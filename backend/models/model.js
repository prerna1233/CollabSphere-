const mongoose = require('mongoose');
const userSChema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    
})

module.exports = mongoose.model('UserDetails',userSChema)