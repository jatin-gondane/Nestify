import dotenv from 'dotenv'
if(process.env.NODE_ENV !="production"){
    dotenv.config();
}
import express from 'express';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';  
import listingRouter from './routes/listing.js';
import reviewRouter from './routes/review.js';
import session from 'express-session';
import flash from "connect-flash";
import passport from 'passport';
import LocalStrategy from 'passport-local';
import {user} from './model/user.js';
import userRouter from './routes/user.js';
import MongoStore from 'connect-mongo'
import { error } from 'console';


let app = express();
const dbUrl = process.env.MongoAtlas;


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto : {
      secret: process.env.secret
  },
  touchAfter : 24 * 3600,
})

store.on('error',()=>{
  console.log('error in mongoatlas session:',error);
  
})

let sessionOption = {
  store,
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
  cookie : { 
    expires : Date.now() + (1000 * 60 * 60 * 24 * 7),
    maxAge :  1000 * 60 * 60 * 24 * 7,
    httpOnly : true,
  }
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/listing'));

// redirect to site
app.get('/',(req,res)=>{
  res.redirect('/listing');
})

app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.existingUser = req.user;
  next();
});

app.use('/listing', listingRouter);
app.use('/listing/:id/review', reviewRouter);
app.use('/',userRouter);


app.use((err,req,res,next)=>{
  let {statusCode=500,message='something went wrong'} = err;
  res.status(statusCode).render('error.ejs',{message});
})


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  console.log('connecting to nestify db..');
}

app.listen(8080, ()=>{
    console.log(`app is running in 8080`);
})