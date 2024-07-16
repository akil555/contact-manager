const roomcontroller = require('./controllers/roomcontroller')
const bookingcontroller = require('./controllers/bookingcontroller')
const usercontroller = require("./controllers/usercontroller")
const {connectdb} = require('./db')
require('dotenv').config();

const express = require('express')

const app = express()

app.use(express.json())

connectdb()
    .then(()=>{console.log('db connected')})
    .catch((err)=>{console.log(err)});

//rooms
app.post('/addrooms',roomcontroller.addroom);
app.get('/getallrooms',roomcontroller.getallrooms);
app.get('/getroombyid/:roomid',roomcontroller.getroombyid);
app.get('/getownerroombyid/:ownerid', roomcontroller.getownerroomsbyid);
app.delete('/deleteroom/:roomid',roomcontroller.deleterooms);

//bookings
app.post('/bookroom',bookingcontroller.bookrooms);
app.put('/cancelbooking',bookingcontroller.cancelbookings)
app.get('/getallbookings',bookingcontroller.getallbookings)
app.get('/getbookingbyuserid/:userid',bookingcontroller.getbookingbyuserid)

//users
app.post('/register',usercontroller.register)
app.post('/login', usercontroller.getuser);
app.get('/getallusers',usercontroller.getallusers);


app.listen(process.env.PORT,()=>{
    console.log("listerning to the port 5000");
})

