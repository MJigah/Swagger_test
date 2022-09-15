const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

/**
 * @swagger
 * '/api/user/register':
 *  post:
 *   summary: Create a new User
 *   tags: [User]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/Schemas/User'
 *   responses:
 *     200:
 *      description: The User was registered Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *     500:
 *      description: Server Error 
 * 
 */

//POST: register a User
router.post('/register', asyncHandler(async(req, res) => {
    //Get details from request
    const { firstname, lastname, email, password, phone_no } = req.body;

    //Throw error if user details is not filled
    if(!firstname || !lastname || !email || !password){
        res.status(400)
        throw new Error('Please add required fields')
    }

    //Check if user already exists
    const checkUser = await User.findOne({email})

    //Throw error if user already exists
    if(checkUser){
        res.status(400)
        throw new Error('User with this email already exists')
    } 

    //Generate hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create or Register new User
    const user = await User.create({
        first_name: firstname,
        last_name: lastname,
        email: email,
        password: hashedPassword,
        phone_no: phone_no
    })

    //Send newly Created User
    if(user){
        res.send({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_no: user.phone_no,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

}))

//POST: Login a User
router.post('/login', asyncHandler(async(req, res) => {
    const { email, password } = req.body

    //Check for user email
    const user = await User.findOne({email})

    if(!user){
        res.status(400)
        throw new Error('User does not Exist!')
    }

    if(user && (await bcrypt.compare(password, user.password))){
        const foundUser = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            token: generateToken(user._id)
        }
        
        res.send(foundUser)
    } else {
        res.status(400)
        throw new Error('Invalid login details')
    }
}))

//Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'abc123', {
        expiresIn: '30d'
    })
}

module.exports = router;