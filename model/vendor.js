const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    phone_no: {
        type: String,
        required: true,
        default: '+234 000 000 000',
    },
    location: {
        lat: {
            type: Number,
            required: true,
            default: 0.0
        },
        lon: {
            type: Number,
            required: true,
            default: 0.0
        },
    },
    manager: {
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
        }
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    meals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meal'
        }
    ],
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {timestamps: true})

module.exports = mongoose.model("Vendor", vendorSchema);