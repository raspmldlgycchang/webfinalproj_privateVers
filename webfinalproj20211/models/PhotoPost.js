const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const PhotoSchema = new Schema({
    name: String,
    location: {type:String, required:true},
    category: {type:String, required:true},

})
const PhotoPost = mongoose.model('photo', PhotoSchema);
module.exports = PhotoPost;