// import userSchema or model

const users = require('../Models/userSchema')
// import token
const jwt =require('jsonwebtoken')
// registerlog
exports.register=async(req,res)=>{
    console.log("inside register method");
    const {username,email,password}= req.body
    console.log(username,email,password);
    // accept data from client
    try{

        // check if the email is already registerd
        const existingUser = await users.findOne({email})
        console.log(existingUser);
        if(existingUser){
            res.status(406).json('already registered')
        }else{
            const newUser = new users({
                username,
                email,
                password,
             

            })
            await newUser.save()
            res.status(200).json(newUser)
        }
       
    }
    catch(err){
        res.status(500).json('Register Failed...')
    }
}

// login logic

exports.login =async(req,res)=>{
    // accep data from client
    const {email,password}=req.body
    try{
        const existingUser=await users.findOne({email,password})
        if(existingUser){
            const token= jwt.sign({userid:existingUser._id},"super2024")
            console.log(token);
            res.status(200).json({existingUser,token})
        }else{
            res.status(404).json("Invalid email or password")
        }

    }
    catch(err){
        res.status(500).json("login failed"+err)
    }
}