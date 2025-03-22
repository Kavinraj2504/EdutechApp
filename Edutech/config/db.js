const mongoose = require('mongoose');
require('dotenv').config();

 function connectDB(){

     try {
         mongoose.connect(process.env.MONGO_URI)
             .then(() => {
                 console.log('MongoDB Connected!');
             })
     }
     catch(err){
         console.error(err);
     }
}

module.exports = connectDB;

