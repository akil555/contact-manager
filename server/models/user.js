const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phonenumber:{
            type:String,
            required:true
        },
        password:{
            type:String,
            require:true
        },
        role:{
            type:String,
            required:true
        },
        isAdmin:{
            type:Boolean,
            required:false
        }
    },
    {
        timestamps:true
    }
)

const userModel = mongoose.model('user',userSchema);

module.exports = userModel
