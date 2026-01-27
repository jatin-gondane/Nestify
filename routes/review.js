import express from 'express';
import {wrapAsync} from '../utiles/wrapAsync.js';
import { reviewValidate,reviewOwnerCheck, reviewLoggedIn } from '../middleware.js';
import controllers from '../controllers/review.js';


let router = express.Router({mergeParams : true});

// post review route
router.post('/',reviewLoggedIn,reviewValidate,wrapAsync(controllers.postReview))

// delete review route
router.delete('/:reviewId/delete',reviewLoggedIn,reviewOwnerCheck,wrapAsync(controllers.destroyReview))

export default router;