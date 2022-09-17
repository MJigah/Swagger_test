const mongoose = require('mongoose')

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
    }
})

module.exports = mongoose.model('Meal', mealSchema);