const express = require('express');
const router = express.Router();
const House = require('../models/house');
const {validateHouses} = require('../middleware');
const wrapAsync = require('../utility/wrapAsync');
const {isLoggedIn, isAuthor, isBusiness} = require('../middleware');
const { cloudinary } = require("../cloudinary");
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', async(req,res)=>{
    const houses = await House.find({});
    res.render('houses/index',{houses});
})

router.get('/new', isLoggedIn,isBusiness, (req,res)=>{
    res.render('houses/new');
})

router.post('/',isLoggedIn,isBusiness,upload.array('image'),validateHouses, wrapAsync(async(req,res)=>{
    const house = new House(req.body);
    house.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    house.user = req.user._id;
    await house.save();
    console.log(house);
    req.flash('success', 'Successfully create new guest house!');
    res.redirect(`/houses/${house._id}`);
}))

router.get('/:id/edit',isLoggedIn,isAuthor, wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const house = await House.findById(id);
    res.render('houses/edit', {house});
}))
router.put('/:id',isLoggedIn,isAuthor,upload.array('image'),validateHouses, wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const house = await House.findByIdAndUpdate(id,req.body);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    house.image.push(...imgs);
    await house.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await house.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully edit guest house!');
    res.redirect(`/houses/${house._id}`)
}))

router.delete('/:id',isLoggedIn,isAuthor, wrapAsync(async(req,res)=>{
    const{id} = req.params;
    await House.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete guest house!');
    res.redirect('/houses');
}))

router.get('/:id', wrapAsync(async(req,res)=>{
    const{id} = req.params;
    const house = await House.findById(id)
    .populate({
        path:'reviews',
        populate:{
            path:'user'
        }
    })
    .populate('user');
    if(!house){
        req.flash('error','Cannot find that guest house!')
        return res.redirect('/houses');
    }
    res.render('houses/show', {house});
}))
module.exports = router;