// import mongoose

const mongoose =require('mongoose')

// Define Connection String

const connectionString = process.env.DATABASE

// connection code

mongoose.connect(connectionString).then(()=>{
    console.log('mongodb atlas connection established');
}).catch((error)=>{
    console.log('mongodb atlass error connection',error);
})