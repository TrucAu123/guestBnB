const mongoose = require('mongoose');
const {Schema} = mongoose;
const Review = require('./review');
const opts = {toJSON:{virtuals:true}};
const imageSchema = new Schema({
    url:String,
    filename:String
})
imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const houseSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:[imageSchema],
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
},opts)
houseSchema.post('findOneAndDelete', async function(camp){
    if(camp.reviews.length){
        const res = await Review.deleteMany({_id:{$in:camp.reviews}});
        console.log(res);
    }
})

const House = mongoose.model('House', houseSchema);
module.exports = House;