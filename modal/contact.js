const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Contact',ContactSchema);