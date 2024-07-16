require('dotenv').config()

const mongoose = require('mongoose');
module.exports.connectdb = ()=>{
   return mongoose.connect(process.env.MONGO_URI);
}
