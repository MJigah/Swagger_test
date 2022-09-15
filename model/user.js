const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *      User:
 *        type: object
 *        required: 
 *          - first_name
 *          - last_name
 *          - email
 *          - password
 *        properties:
 *          first_name: 
 *            type: String
 *            description: The First name of the user
 *          last_name: 
 *            type: String
 *            description: The Last name of the user
 *          email: 
 *            type: String
 *            description: The Email of the user
 *          password: 
 *            type: String
 *            description: The Password of the user
 *        example:
 *          first_name: Jane
 *          last_name: Doe
 *          email: janedoe1234@gmail.com
 *          password: 1234
 */

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
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