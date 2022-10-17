const express = require('express');
const router = express.Router();
const wrapAsync = require('../utility/wrapAsync');
const User = require('../models/user');
const passport=require('passport');
const { urlencoded } = require('express');
const{checkReturnTo} = require('../middleware');
router.get('/register', (req,res)=>{
    res.render('auth/register');
})
router.post('/register', wrapAsync(async(req,res)=>{
    const{username,email,isBusiness,password}= req.body;
    const user = await new User({username,email,isBusiness});
    const registerUser = await User.register(user,password);
    req.login(registerUser, function(err){
        if(err){
            return next(err);
        }
        req.flash('success', 'Welcome to guestBnB');
        res.redirect('/houses');
    })
}))

router.get('/login', (req,res)=>{
    const {returnTo} = req.query;
    res.render('auth/login',{returnTo});
})

router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), (req,res)=>{
    req.flash('success', 'Welcome back!');
    const {returnTo} = req.query;
    if(returnTo.includes('/reviews')){
        const url= returnTo.replace('/reviews','');
        return res.redirect(url);
    }else{
        const url = returnTo || '/houses';
        res.redirect(url);
    }
    
})

router.get('/logout', (req,res)=>{
    req.logout(function(err){
        if(err){return next(err);}
        req.flash('success', 'Goodbye!');
    res.redirect('/houses');
    })
})
module.exports = router