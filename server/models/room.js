const mongoose = require('mongoose')

const roomSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        ownerid: {
            type: String,
            required: true
        },
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        maxcount: {
            type: Number,
            required: true
        },
        phonenumber: {
            type: String,
            required: true
        },
        rentperday: {
            type: Number,
            required: true
        },
        minimumstay: {
            type: Number,
            required: true
        },
        maximumstay: {
            type: Number,
            required: true
        },        
        images: [],
        currentbookings: [],
        amenities: {
            type: [String],
            required: [true, 'Amenities are required'],
            validate: {
                validator: (arr) => arr.length > 0,
                message: 'At least one amenity must be provided'
            }
        },
        description: { type: String, required: true },
        roomdetails: [
            {
                typeofroom:{
                    type:String,
                    required:true
                },
                floorsize:{
                    type:String,
                    required:true
                },
                numberofbeds:{
                    type:Number,
                    required:true
                }
            }
        ],

    },
{
    timestamps: true
}
);

const roomModel = mongoose.model("room", roomSchema)

module.exports = roomModel