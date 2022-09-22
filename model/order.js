const mongoose = require('mongoose')

const shippingAddressSchema ={
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postal_code: {type: String}
};

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order_item: {
        name: {type: String},
        quantity: {type: Number},
        image: {type: String},
        price: {type: Number},
        meal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Meal',
            required: true
        },
    },
    order_date: {
        type: Date,
        required: true
    },
    shipping_address: shippingAddressSchema,
    payment_method: {
        type: String,
        required: true,
    },
    payment_result: {
        id:{type: String},
        status: {type: String},
        update_time: {type: String},
        email_address: {type: String}
    },
    tax_price: {
        type: Number,
        default: 0.0,
    },
    shopping_price: {
        type: Number,
        default: 0.0,
    },
    total_price: {
        type: Number,
        default: 0.0,
    },
    is_paid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paid_at: {
        type: Date,
    },
    is_delivered: {
        type: Boolean,
        required: true,
        default: false
    },
    delivered_at: {
        type: Date
    }
})

module.exports = mongoose.model('Order', orderSchema);