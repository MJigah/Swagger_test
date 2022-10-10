const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    is_admin: {
        type: Boolean,
        default: false,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    phone_no: {
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);