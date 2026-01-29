import { data } from "../model/data.js";
import {config, geocoding } from "@maptiler/client";
import dotenv from 'dotenv'
 import { gmail, nodemailer_mail  } from "../utiles/googlemail.js";
import { cloudinary } from "../cloudinary.js";
dotenv.config();
config.apiKey= process.env.Map_Api_Key;

const index = async (req,res)=>{
  let allData =await data.find();
  res.render('index.ejs',{data : allData})
};

const view = async (req,res)=>{
  let {id} = req.params;
  let dataOFOne = await data.findById(id).populate({ path :'reviews',populate :{
    path : "author",
  }}).populate('owner');
  if(!dataOFOne){
    req.flash('error','listing you requested for does not exist');
    return res.redirect('/');
  }
  res.render('show.ejs',{data : dataOFOne});
}

const newListing = (req,res)=>{
  res.render('newListing.ejs');
}

const savenewlisting =  async (req,res,next)=>{
  let filename = req.file.originalname;
  let imageDestroy = req.file.public_id;
  let url = req.file.url;
  let { title , description , price , location , country } = req.body;
  const result = await geocoding.forward(location);
  if (!result.features || result.features.length === 0) {
    await cloudinary.uploader.destroy(imageDestroy);
  req.flash('error', 'Please enter a valid location!');
  return res.redirect('/listing');
}
  let saving = new data({
    title:title,
    description:description,
    price:price,
    location:location,
    country:country
  });
  
  saving.owner = req.user._id;
  saving.image = {filename,url};
  saving.geometry = result.features[0].geometry;
  saving.category = req.body.category;
  await saving.save();
  req.flash('success','new listing added');
 
  res.redirect('/listing');
}

const edit = async (req,res)=>{
  let {id} = req.params;
  let dataOFOne = await data.findById(id); 
  if(!dataOFOne){
    req.flash('error','listing you requested for does not exist');
    return res.redirect('/')
  }
  let rendeImage = dataOFOne.image.url;
  let rendeImageUrl = rendeImage.replace('/upload','/upload/w_250')
  res.render('edit.ejs', {data : dataOFOne,rendeImageUrl});
}

const update = async (req,res)=>{
  let {id} = req.params;
  let { title , description , price , location , country } = req.body;
    let oldData = await data.findById(id);
  let updateListing = await data.findByIdAndUpdate(id,{ title , description , price , country } );
  let category = req.body.category;
  if(oldData.category !== category){
  updateListing.category = category
  await updateListing.save();
  }
  if(oldData.location !== location){
    const result = await geocoding.forward(location);
    if (!result.features || result.features.length === 0) {
  req.flash('error', 'Please enter a valid location!');
  return res.redirect(`/listing/${id}/view`);
  }
    updateListing.location = location;
    updateListing.geometry = result.features[0].geometry;
    await updateListing.save();
  }

  if(typeof req.file != 'undefined'){
  let filename = req.file.originalname;
  let url = req.file.url;
  updateListing.image = {filename,url};
  await updateListing.save();
  }
  req.flash('success','updated successfully')
  res.redirect(`/listing/${id}/view`);
}

const destroy = async (req,res)=>{
  let {id} = req.params;
  await data.findByIdAndDelete(id);
  req.flash('success','delete successfully')
  res.redirect('/listing');
}

const search = async (req,res) => {
  let clientSearch = req.query.q;
  let findINData = await data.find(
    { $or: [
      {country :{$regex : clientSearch,$options: 'i'}},
      {title:{$regex:clientSearch,$options: 'i'}},
      {location:{$regex:clientSearch,$options: 'i'}},
        ]
  }
  )
  let ids = findINData.map(info => info.id);
  let searchData = await data.find({
    _id : {$in : ids}
  });
  if(searchData.length === 0){
    req.flash('error','your search is not found')
    return res.redirect('/listing')
  }
  res.render('search.ejs', {data : searchData});
}

const category =async (req,res)=>{
    let {categoryName} = req.params;
    let findCategory = await data.find({category : categoryName});
    let categoryId = findCategory.map(items => items.id);
     let categoryIds = await data.find({
    _id : {$in : categoryId}
      });
      if(categoryIds && categoryIds.length === 0){
        req.flash('error','category is not listed as of now.')
        return res.redirect('/listing')
      }
    res.render('search.ejs',{data : categoryIds})
}

const enquiry = async (req, res) => {
  let { id } = req.params;
  let findListing = await data.findById(id).populate('owner');
  let findOwnerEmail = findListing.owner.email;
  let currentUserEmail = res.locals.existingUser.email;
  let currentUserName = res.locals.existingUser.username;

  try {
    // Create email content
    const emailContent = [
      `From: ${currentUserName} <${nodemailer_mail}>`,
      `To: ${findOwnerEmail}`,
      `Subject: Hello! enquiry for your residence`,
      '',
      `You have received a 📩 new enquiry from ${currentUserEmail}.`,
      'This message was sent via our platform, which is currently under active development as part of a learning project.',
      'Thank you for your time and support.'
    ].join('\n');

    // Encode email in base64
    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send email using Gmail API
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    req.flash('success', `enquiry sent successfully. ${findListing.owner.username} will reach you soon. please dont spam!`);
    res.redirect(`/listing/${id}/view`);
  } catch (error) {
    console.log('Gmail API error:', error);
    req.flash('error', 'Failed to send enquiry. Please try again.');
    res.redirect(`/listing/${id}/view`);
  }
};
export default {index,view,newListing,savenewlisting,edit,update,destroy,search,category,enquiry};