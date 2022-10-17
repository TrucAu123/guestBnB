const Joi = require('joi');

const houseJoiSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().min(1),
    description:Joi.string().required(),
    // image:Joi.string().required(),
    deleteImages: Joi.array()
})

const reviewJoiSchema = Joi.object({
    rating:Joi.number().required(),
    body:Joi.string().required(),
})

module.exports ={houseJoiSchema, reviewJoiSchema} ;