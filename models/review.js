const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = Schema({
    body:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
})

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;