const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMon = require('passport-local-mongoose')
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    isBusiness:{
        type:Boolean,
        required:true,
    } //determine if someone allow to make a new guest house

});

userSchema.plugin(passportLocalMon); //give username and password
const User = mongoose.model('User', userSchema);
module.exports = User;