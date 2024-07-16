require('dotenv').config();

const bookingModel = require('../models/booking');
const roomModel = require('../models/room');
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.bookrooms = async (req, res) => {
  try {
    const { room, userid, fromdate, todate, totalAmount, totaldays } = req.body;

    if (!room || !userid || !fromdate || !todate || !totalAmount || !totaldays) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const roomId = room._id;
    const checkInDate = new Date(fromdate);
    const checkOutDate = new Date(todate);
    const daysDiff = Math.ceil((checkOutDate - checkInDate) / 86400000);

    const roombooking = await roomModel.findOne({ _id: roomId }); // or findById

    if (!roombooking) {
      return res.status(404).json({ message: 'Room not found' });
    }
    const minStay = roombooking.minimumstay;
    const maxStay = roombooking.maximumstay;

    if (daysDiff < minStay || daysDiff > maxStay) {
      return res.status(400).json({ message: `Stay duration must be between ${minStay} and ${maxStay} days.` });
    }

    const isBooked = roombooking.currentbookings.some(booking => {
      const fromDate = new Date(booking.fromdate);
      const toDate = new Date(booking.todate);

      return (
        (checkInDate >= fromDate && checkInDate <= toDate) || // Check if check-in date is within any booking
        (checkOutDate >= fromDate && checkOutDate <= toDate) || // Check if check-out date is within any booking
        (checkInDate <= fromDate && checkOutDate >= toDate) // Check if the booking is within the date range
      );
    });

    if (isBooked) {
      return res.status(400).json({ message: 'Room is already booked within the given date range' });
    }

    try {
      // Verify the payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, // Stripe expects the amount in cents
        currency: 'usd', // Adjust based on your currency
        payment_method: "pm_card_visa", // or req.body.paymentMethodId
        confirm: true,
        return_url: 'http://localhost:500/bookroom', // or req.body.returnUrl
      });

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: "Payment failed. Please try again." });
      }

      const newBooking = new bookingModel({
        room: room.name,
        ownerid: room.ownerid,
        roomid: room._id,
        userid,
        fromdate: moment(fromdate).format("YYYY-MM-DD"),
        todate: moment(todate).format("YYYY-MM-DD"),
        totalamount: totalAmount,
        totaldays,
        transactionid: uuidv4(),
      });

      const booking = await newBooking.save();

      roombooking.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format("YYYY-MM-DD"),
        todate: moment(todate).format("YYYY-MM-DD"),
        userid: userid,
        status: booking.status,
      });
      await roombooking.save();

      res.status(200).json({ message: "Booking successful!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.cancelbookings = async (req, res) => {
  const { bookingid, roomid } = req.body;
  try {
    const booking = await bookingModel.findOne({ _id: bookingid });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = "cancelled";
    await booking.save();

    const room = await roomModel.findOne({ _id: roomid });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    room.currentbookings = room.currentbookings.filter(booking => booking.bookingid.toString() !== bookingid);
    await room.save();

    res.send("Your booking cancelled successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.getallbookings = async (req, res) => {
  try {
    const getallbooking = await bookingModel.find({});
    res.send(getallbooking);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.getbookingbyuserid = async (req, res) => {
  const userid = req.params.userid;
  try {
    const bookings = await bookingModel.find({ userid: userid });
    res.send(bookings);
  } catch (err) {
    res.status(500).send(err);
  }
};
