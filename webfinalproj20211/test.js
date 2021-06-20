const mongoose = require('mongoose')
const PhotoPost = require('./models/PhotoPost')
mongoose.connect('mongodb+srv://', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});
PhotoPost.create({
    location:'Daegu',
    category: 'love',
})
PhotoPost.find({location:'Daegu'},function(err,results){
    if(err) return console.log(err)
    else    console.log(results);
});