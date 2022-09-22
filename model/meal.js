const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0.0,
    },
    category: {
        type: String
    },
    count_in_stock: {
        type: Number,
        default: 0,
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model('Meal', mealSchema);