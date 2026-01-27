import { user } from "../model/user.js";

const signup = (req,res)=>{
    res.render('user/signup.ejs')
};

const postSignup = async(req,res)=>{
    try {
        let {email,username,password} = req.body;
    let newUser = new user({email,username});
    let register = await user.register(newUser,password);
    req.login(register, function(err) {
  if (err) { return next(err); }
      req.flash('success','welcome to nestify');
  return res.redirect('/');
     });
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/signup');
    }
}

const login = (req,res)=>{
    res.render('user/login.ejs');
}

const postLogin = async(req, res) => {
    req.flash('success','welcome back to your account')
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
  }

const logout = (req, res, next) => {
req.logout((err) => {
    if (err) { return next(err); }
    req.flash('success','logout successfully');
    res.redirect('/');
  });
}

export default {signup,postSignup,login,postLogin,logout}