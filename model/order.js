const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meal',
        required: true
    },
    order_date: {
        type: Date,
        required: true
    },
    delivery_location: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Order', orderSchema);