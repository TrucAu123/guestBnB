const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const House = require('../models/house');
const wrapAsync = require('../utility/wrapAsync');
const {validateReviews} = require('../middleware');
const {isLoggedIn, isReviewAuthor} = require('../middleware');
router.post('/:id',isLoggedIn, isReviewAuthor,validateReviews, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const house = await House.findById(id);
    const review = new Review(req.body);
    await review.save();
    house.reviews.push(review);
    await house.save();
    res.redirect(`/houses/${house._id}`);
}))

router.delete('/:id/:reviewId', isLoggedIn, isReviewAuthor,wrapAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    const house = await House.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    const review = await Review.findOneAndDelete({_id:reviewId})
    res.redirect(`/houses/${id}`);
}))

module.exports = router;