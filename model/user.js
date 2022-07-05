const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName:{type:String, require:true, minLength:3},
    lastName:{type:String, require:true, minLength:3},
    email:{type:String,require:true,unique:true,match:/.+@.+\..+/},
    password:{type:String},
    token:{type:String}

});
const userModel = mongoose.model('user',userSchema);
module.exports = userModel;