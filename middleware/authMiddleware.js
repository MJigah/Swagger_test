const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/user')

const AdminProtect = asyncHandler(async(req, res, next) => {
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
                res.status(401).json({message: "Unauthorized User!"})
            }

            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({message: "Not Authotrized"})
        }
    }

    if(!token){
        res.status(401).json({message: "Not Authorized, no token"})
    }
})

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
            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({message: "Not Authorized"})
        }
    }

    if(!token){
        res.status(401).json({message: "Not authorized, no token"})
    }
})

//Generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "abc123", {
      expiresIn: "30d",
    });
  };

module.exports = { AdminProtect, protect, generateToken }