const mongoose = require('mongoose')

const vendorSchema = new mongoose.Schema({
    verified: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model("Vendor", vendorSchema);