const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/user')

const protect = asyncHandler(async(req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            //Get token from headers
            token = req.headers.authorization.split(' ')[1]

            //Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'abc123')

            //Get user fron the token
            req.user = await User.findById(decoded.id).select('-password')
            if(!req.user.is_admin){
                res.status(401)
                throw new Error('Unauthorized User!')
            }

            next()
        } catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Not Authorized')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

module.exports = { protect }