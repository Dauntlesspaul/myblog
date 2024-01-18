const mongoose = require('mongoose');
const Latestpost = require('../models/post');
const connectDB= async() =>{
    try{
        mongoose.set('strictQuery',false);
        const conn = await mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Database connected successfully")
        })

    }catch(error){
        console.log(error)
    }
}
module.exports=connectDB;