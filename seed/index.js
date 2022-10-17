const House = require('../models/house');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelper');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/houseApp')
.then(()=>{
    console.log('Connection open!')
})
.catch((err)=>{
    console.log(err)
})
const sample = (array)=>{
    return array[Math.floor(Math.random()*array.length)];
}
const seedDB = async() =>{
    await House.deleteMany({});
    for(let i=0; i<50; i++){
        const price = Math.floor(Math.random()*20)+10;
        const random230= Math.floor(Math.random()*200);
        const newHouse = new House({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: cities[random230].city,
            price:price,
            description: 'Reasonably if conviction on be unsatiable discretion apartments delightful. Are melancholy appearance stimulated occasional entreaties end. Shy ham had esteem happen active county. Winding morning am shyness evident to',
            user:'634c71b6a2d64a7da9991858',
            image:[
                {
                    url: 'https://res.cloudinary.com/dt62affk5/image/upload/v1666026350/guestBnB/cvqpl16zziarhpc727ul.jpg',
                    filename: 'guestBnB/cvqpl16zziarhpc727ul',
                  },
                  {
                    url: 'https://res.cloudinary.com/dt62affk5/image/upload/v1666026351/guestBnB/blw1401ezlyo0acu1gvj.jpg',
                    filename: 'guestBnB/blw1401ezlyo0acu1gvj',
                  },
              
            ]
        })
        await newHouse.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
});;

