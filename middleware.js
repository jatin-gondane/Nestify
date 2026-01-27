import { data } from "./model/data.js";
import { expressError } from './utiles/expressError.js';
import {listingSchema,reviewSchema} from './schema.js'
import { review } from "./model/review.js";
import { rateLimit } from 'express-rate-limit'


const isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','please login to access functionallity');
        return res.redirect('/login');
    }
    next();
};

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const ownerCheck = async (req,res,next) => { 
  let {id} = req.params;
  let dataOFOne = await data.findById(id); 
  const listingID = dataOFOne.owner._id
  
  if(!listingID.equals(res.locals.existingUser._id)){
    req.flash('error','you are not authorized to this residence to make changes or delete');
    return res.redirect(`/listing/${id}`);
  }
  next();
}

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new expressError(400,errMsg);
    }else{
      next();
    }
}

const reviewValidate = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new expressError(400,errMsg);
    }else{
      next();
    }
}

const reviewOwnerCheck = async (req,res,next) => { 
  let {id,reviewId} = req.params;
  let dataOFOne = await review.findById(reviewId); 
  const reviewFinalId = dataOFOne.author._id
  if(!reviewFinalId.equals(res.locals.existingUser._id)){
    req.flash('error','you are not authorized to this review, to make changes or delete');
    return res.redirect(`/listing/${id}/view`);
  }
  next();
}

const reviewLoggedIn = async (req,res,next) =>{
  let {id} = req.params;
  if(!res.locals.existingUser){
    req.flash('error', 'you have to login to make changes')
    return res.redirect(`/listing/${id}/view`)
  }
  next();
}

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 3 minutes
	limit: 1, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  handler : (req,res) =>{
    req.flash('error', 'you reached your limit! to sending enquiry to any residence please try again after 2 min..')
    return res.redirect('/listing')
  }
	// store: ... , // Redis, Memcached, etc. See below.
})

export {isLoggedIn,saveRedirectUrl,ownerCheck,validateListing,reviewValidate,reviewOwnerCheck,reviewLoggedIn,limiter};
