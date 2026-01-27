import mongoose, { Schema } from "mongoose"; 

const reviewSchema = new Schema({
    Comment : String,
    rating : {
        type : Number,
        min : 1 ,
        max : 5
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author : {
         type : mongoose.Schema.Types.ObjectId,
         ref : "user"
    }
});

let review = mongoose.model("review", reviewSchema);
export {review};