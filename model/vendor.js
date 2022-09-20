const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    verified: {
        type: Boolean,
        default: false,
        required: true
    }
})

module.exports = mongoose.model("Vendor", vendorSchema);