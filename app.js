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
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/houseApp';
mongoose.connect(dbUrl);   
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith:'_'
}));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
const secret = process.env.SECRET ||'thisshouldbebettersecret!'
const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24*3600,
})
store.on("error",function(e){
    console.log('session store error',e)
});
app.use(session({
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        // secure:true, //cookie only can change when access through http
        expires: Date.now()+ 1000*60*60*24*7, //expire a week from now
        maxAge:1000*60*60*24*7
    },
    store:store,
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
    res.render('home');
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
const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('Listen on port ',port)
})