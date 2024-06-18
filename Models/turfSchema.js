const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  turfName: {
    type: String,
    required: true
  },
  turfImage: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  turfMobile: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerMobile: {
    type: String,
    required: true
  },
  hourlyPrice: {
    type: Number,
    required: true
  },
  dailyPrice: {
    type: Number,
    required: true
  },
  monthlyPrice: {
    type: Number,
    required: true
  },
  acknowledgement: {
    type: Boolean,
    required: true
},
selectedTimeSlots: {
    type: [String],
    default: []
  },
  userId:{
    type:String,
    required:true
}
});

const Turf = mongoose.model('Turf', turfSchema);

module.exports = Turf;


// const mongoose = require('mongoose');

// const turfCardSchema = new mongoose.Schema({
//     turfName: {
//         type: String,
//         required: true
//     },
//     location: {
//         type: String,
//         required: true
//     },
//     phoneNumber: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     availableSlots: {
//         type: [String],
//         required: true
//     },
//     image: {
//         type: String,
//         required: true
//     }
// });

// const TurfCard = mongoose.model('TurfCard', turfCardSchema);

// module.exports = TurfCard;




// // // 1.import mongoose

// // const mongoose = require('mongoose')

// // // 2.schema creation

// // const turfSchema = new mongoose.Schema({
// //     turfname:{
// //         type:String,
// //         required:true
// //     },
// //     turfaddress:{
// //         type:String,
// //         required:true
// //     },

// //     turfnumber:{
// //         type:Number,
// //         required:true
// //     },
// //     ownername:{
// //         type:String,
// //         required:true
// //     },
// //     ownernumber:{
// //         type:Number,
// //         required:true
// //     }, pricedetails:{
// //         type:String,
// //         required:true
// //     },
// //      turfImage:{
// //         type:String,
// //         required:true
// //     }, userId:{
// //         type:String,
// //         required:true
// //     }
// // })

// // // create model

// // const turf =mongoose.model('Turf',turfSchema)

// // module.exports=turf