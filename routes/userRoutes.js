const express = require('express')
const router = express.Router()
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

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
 *          firstname: Jane
 *          lastname: Doe
 *          email: janedoe1234@gmail.com
 *          password: '1234'
 *          phone_no: '+2349030980577'
 */

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
 *          $ref: '#/components/schemas/User'
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

/**
 * @swagger
 * '/api/user/login':
 *  post:
 *   summary: Authenticate existing User
 *   tags: [User]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/User'
 *   responses:
 *     200:
 *      description: The User has logged in Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *     400:
 *      description: Invalid Login Details
 *     500:
 *      description: Server Error 
 * 
 */

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


/**
 * @swagger
 * '/api/user/{id}/changePassword':
 *  put:
 *   summary: Update User password
 *   tags: [User]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The user id
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/User'
 *   responses:
 *     200:
 *      description: Password updated Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *     400:
 *      description: Invalid Details
 *     500:
 *      description: Server Error 
 * 
 */

//PUT: Update details of existing user

router.put('/:id/changePassword', asyncHandler(async(req, res) => {
    const {old_password, new_password } = req.body
    //Get user Details
    const foundUser = await User.findById(req.params.id)
    //Compare user details with former password
    if(foundUser && (await bcrypt.compare(old_password, foundUser.password))){
        //Generate salt for new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(new_password, salt)
        //change password if true
        const newUser = await User.findByIdAndUpdate(req.params.id, {password: hashedPassword})
        
        //return user details
        res.send({...newUser, token: generateToken(newUser._id)})
    } else {
        res.status(400)
        throw new Error('Invalid password')
    }
}))

//Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'abc123', {
        expiresIn: '30d'
    })
}

module.exports = router;