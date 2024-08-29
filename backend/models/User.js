const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator')

const userSchema = new Schema({
    name:{
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        validator : {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }
});


module.exports = mongoose.model('User', userSchema);