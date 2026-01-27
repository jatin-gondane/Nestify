import mongoose, { Schema } from "mongoose"; 
import passportLocalMongoose from "passport-local-mongoose";

let userSchema = new Schema({
    email :{ 
      type : String,
      require : true}
})

userSchema.plugin(passportLocalMongoose.default);

let user = mongoose.model('user', userSchema);
export {user};