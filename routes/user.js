import express from 'express';
import { wrapAsync } from '../utiles/wrapAsync.js';
import passport from 'passport';
import { saveRedirectUrl } from '../middleware.js';
import controllers from "../controllers/user.js"

let router = express.Router({mergeParams : true});

router.route('/signup')
.get(controllers.signup)
.post(wrapAsync(controllers.postSignup));

router.route('/login')
.get(controllers.login)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' , failureFlash : true}),controllers.postLogin);

router.get('/logout',controllers.logout);

export default router;