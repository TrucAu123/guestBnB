if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const houseRoutes = require('./routes/houses');
const reviewRoutes=require('./routes/review');
const authRoutes = require('./routes/auth');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utility/expressError');
const session = require('express-session');
const flash = require('connect-flash');
const User= require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/houseApp')
    .then(()=>{
        console.log('Connection open!')
    })
    .catch((err)=>{
        console.log(err)
    })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.use(session({
    name:'session',
    secret: 'thisshouldbebettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        // secure:true, //cookie only can change when access through http
        expires: Date.now()+ 1000*60*60*24*7, //expire a week from now
        maxAge:1000*60*60*24*7
    }
}))
app.use(passport.initialize());
app.use(passport.session()); // make sure session use before passport.session
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


app.get('/', (req,res)=>{
    res.send('Home page')
})

app.use('/houses', houseRoutes);
app.use('/houses/reviews', reviewRoutes);
app.use('/', authRoutes);
app.all('*', (req,res,next)=>{
    next(new ExpressError('Page Not Found', 404))
})
app.use((err,req,res,next)=>{
    const {statusCode = 500} =err;
    if(!err.message) err.message='Something went wrong';
    res.status(statusCode).render('error',{err});
    
})
app.listen(3000,()=>{
    console.log('Listen on port 3000')
})