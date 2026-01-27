import { data } from "../model/data.js";
import { review } from "../model/review.js";

const postReview = async (req,res) => {
  let listing = await data.findById(req.params.id);
  let newReview = new review(req.body.reviews)
  let id = req.params.id;
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash('success', 'review added successfully');
    res.redirect(`/listing/${id}/view`);
};

const destroyReview = async(req,res)=>{
  let {id,reviewId} = req.params;
  await data.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
  await review.findByIdAndDelete(reviewId);
  req.flash('success','review deleted successfully');
  res.redirect(`/listing/${id}/view`)
}

export default {postReview,destroyReview};