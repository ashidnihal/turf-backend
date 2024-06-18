const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  turfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  bookedTimeRanges: {
    type: [String],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  // verificationOTP: {
  //   type: String,
  //   required: true,
  // },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;




















// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   turfId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Turf',
//     required: true,
//   },
//   bookedTimeRanges: {
//     type: [String],
//     required: true,
//   },
//   verificationOTP: {
//     type: String,
//     required: true,
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Booking = mongoose.model('Booking', bookingSchema);

// module.exports = Booking;
