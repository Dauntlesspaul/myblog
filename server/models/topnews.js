const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FileSchema = new Schema({
    filename: String,
    contentType: String,
    bucketName: String
});
const TopPostSchema = new Schema({
    images: [FileSchema], // Store references to image files
    videos: [FileSchema], // Store references to video files
    link: String,
    title: {
        type: String,
        required: true
    },
    lead: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    body2: String,
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
TopPostSchema.index({ createdAt: 1})
module.exports = mongoose.model("Toppost",TopPostSchema)