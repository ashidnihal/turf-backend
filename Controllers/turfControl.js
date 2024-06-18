// Import the Turf model
const Turf = require('../Models/turfSchema');

exports.addTurf = async (req, res) => {
    console.log("Inside Add turf");
    
    // Extract data from request body
    const { turfName, location, turfMobile, ownerName, ownerMobile, hourlyPrice, dailyPrice, monthlyPrice, acknowledgement, selectedTimeSlots } = req.body;

    // Assuming you're also uploading an image and storing the filename in req.file.filename
    const turfImage =req.file.filename

    // Assuming you have user ID in the request payload
    const userId = req.payload;

    console.log(turfName, location, turfMobile, ownerName, ownerMobile, hourlyPrice, dailyPrice, monthlyPrice, acknowledgement, turfImage, userId, selectedTimeSlots);

    try {
        // Check if turf with the same name already exists
        const existingTurf = await Turf.findOne({ turfName });

        if (existingTurf) {
            // If turf already exists, return an error
            return res.status(400).json({ message: "Turf already exists" });
        }

        // If turf doesn't exist, create a new turf object
        const newTurf = new Turf({
            turfName,
            turfImage,
            location,
            turfMobile,
            ownerName,
            ownerMobile,
            hourlyPrice,
            dailyPrice,
            monthlyPrice,
            acknowledgement,
            selectedTimeSlots,
            userId
        });

        // Save the new turf object to the database
        await newTurf.save();

        // Return the newly created turf object
        res.status(201).json(newTurf);
    } catch (error) {
        // If an error occurs, return an error response
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//2. get all user turf details
exports.getAllUserTurf=async(req,res)=>{
    //   search
        const search=req.query.search
        console.log(search);
    
            let query={}
            if(search){
                query.location = {$regex:search,$options:"i"}
            }
       
            
        try{
            const getAllUserTurf= await Turf.find(query)
        if(getAllUserTurf){
            res.status(200).json(getAllUserTurf)
        }
        else{
            res.status(401).json("Can't find the Turf")
        }
        }
        catch(err){
            res.status(401).json({message:err.message})
        }
        }

// 1.get a particular user turf details
exports.getTurf=async(req,res)=>{
    const userId=req.payload
    const search=req.query.search
    let query = { userId };
    if(search){
        query.location = {$regex:search,$options:"i"}
    }
    try{
        const getATurf= await Turf.find(query)
    if(getATurf){
        res.status(200).json(getATurf)
    }
    else{
        res.status(401).json("Can't find the turf")
    }
    }
    catch(err){
        res.status(401).json({message:err.message})
    }
    }