require('dotenv').config() // 1
//2 import express
const express=require('express')
// 3.import cors
const cors =require('cors')
// 7.import db
const db = require('./DB/connection')
// 8.import router
const router =require('./Routes/router')
// 9
// const applicationMiddleware=require('./Middlewares/applicationMiddleware')
// 4. create a appliction using express
const tfserver =express()
// 5.use
tfserver.use(cors())
tfserver.use(express.json())//middleware
// tfserver.use(applicationMiddleware)
tfserver.use(router)


// / used to export images from backend
tfserver.use('/uploads',express.static('./uploads'))
// tfserver.use('/api/payment', paymentRoutes);
//6. port creation
const PORT =4000 || process.env.PORT

tfserver.listen(PORT,()=>{
    console.log('tfserver listening on port '+PORT);
})
tfserver.get('/',(req,res)=>{
    res.send('welcome to turfease')
})