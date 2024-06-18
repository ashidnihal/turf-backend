const Turf = require('../Models/turfSchema');
const Booking = require('../Models/bookingSchema');
const User = require('../Models/userSchema');

exports.getAllTurfsadmin = async (req, res) => {
  const search=req.query.search
  console.log(search);

      let query={}
      if(search){
          query.turfName = {$regex:search,$options:"i"}
      }
  try {
    const turfs = await Turf.find(query);
    if(turfs){
      res.status(200).json(turfs);
    }else{
      res.status(401).json("Can't find the Turf")
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllBookingadmin = async (req, res) => {
  const search = req.query.search;
  console.log(search);

  try {
    let query = {};
    if (search) {
      // Instead of searching in Booking, we'll search in the related Turf documents
      const turfs = await Turf.find({ turfName: { $regex: search, $options: "i" } }, '_id');
      const turfIds = turfs.map(turf => turf._id);
      query.turfId = { $in: turfIds };
    }

    const bookings = await Booking.find(query)
      .populate('turfId', 'turfName')
      .populate('userId', 'username');

    if (bookings.length > 0) {
      res.status(200).json(bookings);
    } else {
      res.status(404).json("No bookings found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.getAllUsersadmin = async (req, res) => {
  const search=req.query.search
  console.log(search);

      let query={}
      if(search){
          query.username = {$regex:search,$options:"i"}
      }
  try {
    const user = await User.find(query);
    if(user){
      res.status(200).json(user);
    }else{
      res.status(401).json("Can't find the User")
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Add more methods for adding, updating, deleting turfs, etc.
// delete turf
exports.deleteBooking=async(req,res)=>{
  const {pid} = req.params; 
  console.log(pid);// Get booking id from params
  try {
    const deleteBooking = await Booking.findOneAndDelete({ _id:pid});
    if (!deleteBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully', data: deleteBooking });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }

}

// delete turf
exports.deleteTurf=async(req,res)=>{
  const {pid} = req.params; 
  console.log(pid);// Get booking id from params
  try {
    const deleteTurf = await Turf.findOneAndDelete({ _id:pid});
    if (!deleteTurf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.status(200).json({ message: 'Turf deleted successfully', data: deleteTurf });
  } catch (err) {
    console.error('Error deleting Turf:', err);
    res.status(500).json({ message: 'Internal server error' });
  }

}

// delete user
exports.deleteUser=async(req,res)=>{
  const {pid} = req.params; 
  console.log(pid);// Get booking id from params
  try {
    const deleteUser = await User.findOneAndDelete({ _id:pid});
    if (!deleteUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully', data: deleteUser });
  } catch (err) {
    console.error('Error deleting User:', err);
    res.status(500).json({ message: 'Internal server error' });
  }

}