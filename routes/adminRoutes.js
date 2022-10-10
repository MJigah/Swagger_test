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
 *      Admin:
 *        type: object
 *        securitySchemes:
 *          bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *        required: 
 *          - first_name
 *          - last_name
 *          - email
 *          - password
 *          - is_admin
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
 *          is_admin: 
 *            type: String
 *            description: The admin role of the user
 *          password: 
 *            type: String
 *            description: The Password of the user
 *        example:
 *          firstname: Admin
 *          lastname: Doe
 *          email: admin@gmail.com
 *          password: '1234'
 *          is_admin: true
 *          phone_no: '+2349030980577'
 */

/**
 * @swagger
 * '/api/admin/register':
 *  post:
 *   summary: Create a new Admin
 *   tags: [Admin]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Admin'
 *   responses:
 *     200:
 *      description: The Admin was registered Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *     500:
 *      description: Server Error
 */

//POST: register an Admin
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

    //Create or Register new Admin User
    const user = await User.create({
        first_name: firstname,
        last_name: lastname,
        email: email,
        is_admin: true,
        password: hashedPassword,
        phone_no: phone_no
    })

    //Send newly Created Admin User
    if(user){
        res.send({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            is_admin: user.is_admin,
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
 * '/api/admin/login':
 *  post:
 *   summary: Authenticate existing Admin User
 *   tags: [Admin]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Admin'
 *   responses:
 *     200:
 *      description: The Admin has logged in Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Admin'
 *     400:
 *      description: Invalid Login Details
 *     500:
 *      description: Server Error 
 * 
 */

//POST: Login an Admin User
router.post('/login', asyncHandler(async(req, res) => {
    const { email, password } = req.body

    //Check for user email
    const user = await User.findOne({email})
    
    if(!user){
        res.status(400)
        throw new Error('User does not Exist!')
    }
    
    if(!user.is_admin){
        res.status(401)
        throw new Error('Unauthorized User!')
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
 * '/api/admin/{id}/changePassword':
 *  put:
 *   summary: Update Admin password
 *   tags: [Admin]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The admin id
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Admin'
 *   security:
 *     - bearerAuth: []
 *   responses:
 *     200:
 *      description: Password updated Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Admin'
 *     400:
 *      description: Invalid Details
 *     500:
 *      description: Server Error 
 * 
 */

//PUT: Update details of existing admin

router.put('/:id/changePassword', asyncHandler(async(req, res) => {
    const {old_password, new_password } = req.body
    //Get user Details
    const foundUser = await User.findById(req.params.id)
    if(!foundUser.is_admin){
        res.status(401)
        throw new Error('Unauthorized User!');
    }
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

router.get('/:id', asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    res.send(user);
}))

//Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'abc123', {
        expiresIn: '30d'
    })
}

module.exports = router;