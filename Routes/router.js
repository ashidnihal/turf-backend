//  import express
const express =require('express')

const jwtMiddleware =require('../Middlewares/jwtMiddleware')

const multerConfig = require('../Middlewares/multerMiddleware')
// import userCOntroller

const userController = require('../Controllers/userControllers')
const turfController = require('../Controllers/turfControl')
const bookingController = require('../Controllers/bookingControl')
const adminController= require('../Controllers/adminControl')

//  create router objects of express to define path
const router = express.Router()

// registerapi
router.post('/register',userController.register)
// login api call
router.post('/login',userController.login)

router.post('/turf/add-turf',jwtMiddleware,multerConfig.single('turfImage'),turfController.addTurf)

// all user turf
router.get('/turf/get-all-turf',jwtMiddleware,turfController.getAllUserTurf)
// particular user turf
router.get('/turf/getturf',jwtMiddleware,turfController.getTurf)

// Booking APIs
router.post('/turf/book', jwtMiddleware, bookingController.bookTurf);
// router.post('/turf/verify-booking', bookingController.verifyBooking);
// booked slots
router.get('/turf/bookedslots',bookingController.bookedSlots);


// admin
// all turf admin
router.get('/turf/admin/allturf',jwtMiddleware,adminController.getAllTurfsadmin)

router.get('/turf/admin/bookings',jwtMiddleware,adminController.getAllBookingadmin)

router.get('/turf/admin/users',jwtMiddleware,adminController.getAllUsersadmin)

// delete booking
router.delete('/turf/delete-a-booking/:pid', jwtMiddleware,adminController.deleteBooking);
// delete turf
router.delete('/turf/delete-a-turf/:pid', jwtMiddleware,adminController.deleteTurf);
// delete user
router.delete('/turf/delete-a-user/:pid', jwtMiddleware,adminController.deleteUser);

module.exports=router