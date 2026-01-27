import mongoose from 'mongoose';
import { review } from './review.js';

let dataSchema = new mongoose.Schema({
    title : {
      type : String,
      require : true
    },
    description : {
        type:String,
        require:true
    },
      image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      require:true
    }
  },
    price : {
        type : Number,
        require : true
    },
    location : {
        type : String,
        require : true
    },
    country : {
        type : String, 
        require : true
    },
    reviews : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "review"
    }],
    owner : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "user"
    },
    geometry : {
    type: {
      type: String, 
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
  category : {
    type : String,
    enum: ['Trending', 'Rooms', 'Iconic cities', 'Mountains', 'Castles', 'Amazing pools', 'Camping', 'Farms', 'Artic', 'Domes', 'Boats'],
    required: true
  }
});

dataSchema.post('findOneAndDelete',async(data)=>{
  if(data){
    await review.deleteMany({ _id: { $in: data.reviews } });
  }
});

let data = mongoose.model('data',dataSchema);
export { data };