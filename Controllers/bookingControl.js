const Booking = require('../Models/bookingSchema');  // Ensure the correct path and case
const Turf = require('../Models/turfSchema');
const User = require('../Models/userSchema');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { format } = require('date-fns');
require('dotenv').config();

exports.bookTurf = async (req, res) => {
  const { turfId, bookedTimeRanges, date, token, amount } = req.body;
  const userId = req.payload; 

  // Check if the booking date is within three days from now
  const bookingDate = new Date(date);
  const today = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(today.getDate() + 3);

  if (bookingDate > threeDaysFromNow) {
    return res.status(400).json({ message: 'Bookings can only be made up to three days in advance' });
  }

  try {
    // Find the turf
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for overlapping bookings
    const existingBookings = await Booking.find({
      turfId,
      date: bookingDate,
      bookedTimeRanges: { $in: bookedTimeRanges },
      isVerified: true,
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Selected time slots are already booked' });
    }

    // Process payment
    let payment;
    try {
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });

      payment = await stripe.paymentIntents.create(
        {
          amount: amount * 100, // Amount in smallest currency unit
          customer: customer.id,
          currency: 'inr',
          receipt_email: token.email,
        },
        {
          idempotencyKey: uuidv4(),
        }
      );
    } catch (error) {
      return res.status(500).json({ message: 'Payment processing failed', error: error.message });
    }

    // Create the booking
    const booking = new Booking({
      turfId,
      userId,
      bookedTimeRanges,
      date: bookingDate,
      isVerified: true,
    });

    await booking.save();

    // Send confirmation email
    await sendConfirmationEmail(user.email, booking);

    res.status(201).json({ message: 'Booking created successfully', bookingId: booking._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function sendConfirmationEmail(userEmail, booking) {
  // Populate turf name
  await booking.populate('turfId');
  const turfName = booking.turfId.turfName;

  // Format the date
  const formattedDate = format(new Date(booking.date), 'dd/MM/yyyy');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const bookingDetails = `
    Your booking has been confirmed!
    Booking ID: ${booking._id}
    Turf Name: ${turfName}
    Date: ${formattedDate}
    Time Ranges: ${booking.bookedTimeRanges.join(', ')}
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Booking Confirmation',
    text: bookingDetails,
  });
}

exports.bookedSlots = async (req, res) => {
  const { turfId, date } = req.query;

  try {
    const bookedSlots = await Booking.find({ turfId, date });

    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

















// const Booking = require('../Models/bookingSchema');  // Ensure the correct path and case
// const Turf = require('../Models/turfSchema');
// const User = require('../Models/userSchema');
// const nodemailer = require('nodemailer');
// const { v4: uuidv4 } = require('uuid');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const { format } = require('date-fns');
// require('dotenv').config();

// exports.bookTurf = async (req, res) => {
//   const { turfId, bookedTimeRanges, date, token, amount } = req.body;
//   const userId = req.payload; 

//   // Check if the booking date is within three days from now
//   const bookingDate = new Date(date);
//   const today = new Date();
//   const threeDaysFromNow = new Date();
//   threeDaysFromNow.setDate(today.getDate() + 3);

//   if (bookingDate > threeDaysFromNow) {
//     return res.status(400).json({ message: 'Bookings can only be made up to three days in advance' });
//   }

//   try {
//     // Find the turf
//     const turf = await Turf.findById(turfId);
//     if (!turf) {
//       return res.status(404).json({ message: 'Turf not found' });
//     }

//     // Find the user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check for overlapping bookings
//     const existingBookings = await Booking.find({
//       turfId,
//       date: bookingDate,
//       bookedTimeRanges: { $in: bookedTimeRanges },
//       isVerified: true,
//     });

//     if (existingBookings.length > 0) {
//       return res.status(400).json({ message: 'Selected time slots are already booked' });
//     }

//     // Process payment
//     let payment;
//     try {
//       const customer = await stripe.customers.create({
//         email: token.email,
//         source: token.id,
//       });

//       payment = await stripe.paymentIntents.create(
//         {
//           amount: amount * 100, // Amount in smallest currency unit
//           customer: customer.id,
//           currency: 'inr',
//           receipt_email: token.email,
         
//         },
//         {
//           idempotencyKey: uuidv4(),
//         }
//       );
//     //  res.send('payment successful, your turf is booked')
   
//     } catch (error) {
//       // console.error('Payment error:', paymentError);
//       // return res.status(500).json({ message: 'Payment processing failed', error: paymentError.message });
//       res.status(500).json({error});
   
//     }
//   //   if (payment.status !== 'succeeded') {
//   //     return res.status(400).json({ message: 'Payment failed' });
//   //   }
//   // } catch (paymentError) {
//   //   console.error('Payment error:', paymentError);
//   //   return res.status(500).json({ message: 'Payment processing failed', error: paymentError.message });
//   // }

//     // Create the booking
//     const booking = new Booking({
//       turfId,
//       userId,
//       bookedTimeRanges,
//       date: bookingDate,
//       isVerified: true,
//     });

//     await booking.save();

//     // Send confirmation email
//     await sendConfirmationEmail(user.email, booking);

//     res.status(201).json({ message: 'Booking created successfully', bookingId: booking._id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// async function sendConfirmationEmail(userEmail, booking) {
//   // Populate turf name
//   await booking.populate('turfId').execPopulate();
//   const turfName = booking.turfId.turfName;

//   // Format the date
//   const formattedDate = format(new Date(booking.date), 'dd/MM/yyyy, HH:mm:ss');

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const bookingDetails = `
//     Your booking has been confirmed!
//     Booking ID: ${booking._id}
//     Turf Name: ${turfName}
//     Date: ${formattedDate}
//     Time Ranges: ${booking.bookedTimeRanges.join(', ')}
//   `;

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: userEmail,
//     subject: 'Booking Confirmation',
//     text: bookingDetails,
//   });
// }

// exports.bookedSlots = async (req, res) => {
//   const { turfId, date } = req.query;

//   try {
//     const bookedSlots = await Booking.find({ turfId, date });

//     res.status(200).json(bookedSlots);
//   } catch (error) {
//     console.error('Error fetching booked slots:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
