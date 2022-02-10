const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter username"],
        trim: true,
        lowercase: true
    },
    firstname: {
        type: String,
        required: [true, "Please enter first name"],
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        required: [true, "Please enter last name"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        trim: true
    },
    createon: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;