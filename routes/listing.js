import express from 'express';
import {wrapAsync} from '../utiles/wrapAsync.js';
import { isLoggedIn,limiter,ownerCheck,validateListing } from '../middleware.js';
import controllers from '../controllers/listing.js';
import multer from 'multer';
import { storage } from '../cloudinary.js';


let router = express.Router({mergeParams : true});
const upload = multer({ storage });;

// new listing
router.get('/new',isLoggedIn,controllers.newListing);

//index&savenewlisting;
router.route('/')
.get(controllers.index)
.post(isLoggedIn,upload.single('image[url]'),validateListing, wrapAsync(controllers.savenewlisting));

//view route
router.get('/:id/view',controllers.view);

//search 
router.get('/search', controllers.search);

// category
router.get('/category/:categoryName',controllers.category);

// for enquiry or notificatin sending
router.post('/:id/view/enquiry',isLoggedIn,limiter,controllers.enquiry)

//edit,updating with put in db&delete
router.route('/:id')
.get(isLoggedIn,ownerCheck,controllers.edit)
.put(ownerCheck,upload.single('image[url]'),validateListing,wrapAsync(controllers.update))
.delete(isLoggedIn,ownerCheck,controllers.destroy);

export default router;