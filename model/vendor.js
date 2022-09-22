const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
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
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }
})

module.exports = mongoose.model("Vendor", vendorSchema);