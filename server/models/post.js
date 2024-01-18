const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema({
    img:{
    data:Buffer,
    contentType: String
    },
    vid:{
    data:Buffer,
    contentType: String,
    },
    title:{
    type:String,
    required:true
    },
    lead:{
    type:String,
    required:true
    },
    body:{
    type:String,
    required:true
    },
    body2:{
    type:String
    },
    category:{
    type:String,
    required:true
    },
    createdAt:{
    type:Date,
    default:Date.now
    },
    updatedAt:{
    type:Date,
    default:Date.now
    }
})
module.exports = mongoose.model("Latestpost",PostSchema)