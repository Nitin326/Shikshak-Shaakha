const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    gender:{
        type:String
    },
    phone:{
        type:String
    },
    facebook:{
        type:String
    },
    instagram:{
        type:String
    },
    subject:{
        type:String
    },
    qualification:{
        type:String
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    pincode:{
        type:String
    },
    password:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('UserDetail',UserSchema);