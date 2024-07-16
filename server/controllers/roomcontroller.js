const roomModel = require('../models/room')
const cloudinary = require("../cloudinary/cloudinary")
const upload = require('../cloudinary/multer')
const fs = require('fs')

module.exports.addroom = [
    upload.array('images', 10),
    async (req, res) => {
        try {
            const { name, ownerid, maxcount, phonenumber, rentperday, minimumstay, maximumstay, type, description, roomdetails, currentbookings, amenities, city, address } = req.body;
            const roomDetailsArray = JSON.parse(roomdetails);

            const imageFiles = [];

            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, { folder: 'room_images' });
                imageFiles.push(result.secure_url);
                fs.unlinkSync(file.path);
            }

            const newRoom = new roomModel({
                name,
                ownerid,
                maxcount,
                phonenumber,
                rentperday,
                minimumstay,
                maximumstay,
                type,
                city,
                address,
                description,
                roomdetails: roomDetailsArray,
                images: imageFiles,
                currentbookings,
                amenities
            });

            const savedRoom = await newRoom.save();
            res.status(201).json(savedRoom);
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Failed to add room', error: err.message });
        }
    }
];

module.exports.getallrooms = async (req, res) => {
    try {
        const getrooms = await roomModel.find({})
        res.send(getrooms)
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports.getroombyid = async (req, res) => {
    try {
        const { roomid } = req.params.roomid
        const room = await roomModel.findOne({ roomid });
        res.send(room)
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}


module.exports.getownerroomsbyid = async (req, res) => {
    const {ownerid}  = req.params;
    try {
        const rooms = await roomModel.find({ ownerid: ownerid });
        console.log(rooms);
        res.send(rooms);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


module.exports.deleterooms = async (req, res) => {
    const {roomid} = req.params;

    try {
        const deleteroom = await roomModel.findOneAndDelete({ _id: roomid });
        if (!deleteroom) {
            return res.status(404).send({ message: 'Room not found' });
        }
        res.status(200).send({ message: 'Room deleted successfully' });

    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}










