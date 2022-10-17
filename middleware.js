const House = require('./models/house');
const {houseJoiSchema, reviewJoiSchema} = require('./models/joiSchema');
const ExpressError = require('./utility/expressError')
const Review = require('./models/review');

const validateHouses = (req,res,next)=>{
    const { error } = houseJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReviews = (req,res,next)=>{
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
        req.flash('error', 'You must be signed in!');
        return res.redirect(`/login?returnTo=${fullUrl}`);
    }
    next();
}

const isAuthor = async(req,res,next)=>{
    const{id} = req.params;
    const house = await House.findById(id);
    if(!house.user.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/houses/${id}`)
    }
    next()
}

const isReviewAuthor = async(req,res,next)=>{
    const{id,reviewId} = req.params;
    const findReview = await Review.findById(reviewId);
    if(!findReview.user.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/houses/${id}`)
    }
    next()
}

const isBusiness = async(req,res,next)=>{
    const{isBusiness} = req.user;
    if(!isBusiness){
        req.flash('error', 'You need to have a business account to do this!')
        return res.redirect('/houses')
    }
    next()
}
// const checkReturnTo = (req,res,next)=>{
//     if(req.session.returnTo){
//         req.locals.returnTo=req.session.returnTo;
//     }
// }

module.exports = {validateHouses, validateReviews,isLoggedIn,isReviewAuthor, isBusiness,isAuthor};