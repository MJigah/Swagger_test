const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: {
        type: String,
    },
    ratings: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Review', reviewSchema);