import Joi from "joi";

export const listingSchema = Joi.object({
    title : Joi.string().required(),
    description:Joi.string().required(),
    image:Joi.alternatives().try(Joi.string(), Joi.object(), Joi.allow('', null)),
    price:Joi.number().min(1).required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    category:Joi.string()
})

export const reviewSchema = Joi.object({
    reviews : Joi.object({
        rating : Joi.number().min(1).max(5).required(),
        Comment : Joi.string().required(),
    }).required()
});