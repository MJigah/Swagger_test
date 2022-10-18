const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { protect, protectAdmin } = require("../middleware/authMiddleware");
const { getUserDetails, registerUser, loginUser, updateUserPassword, deleteUserAccount, updateUserDetails } = require("../controller/auth");

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
 *          first_name: "String"
 *          last_name: "String"
 *          email: "String"
 *          password: 'String'
 *          phone_no: 'String'
 */

//GET: seed to db
router.get(
    "/seed",
    asyncHandler(async (req, res) => {
      const reviews = await User.insertMany(mealDb.user);
      // await Vendor.deleteMany()
      res.send(reviews);
    })
  );

/**
 * @swagger
 * '/api/user':
 *  get:
 *   summary: Get User details
 *   tags: [User]
 *   security:
 *     - bearerAuth: []
 *   responses:
 *     200:
 *      description: The Users are displayed successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *     404:
 *      description: Not Found
 *     500:
 *      description: Server Error
 *
 */

//GET: find a user by id
router.get('/', protect, getUserDetails)

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
router.post("/register", registerUser);

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
 *          type: object
 *        required:
 *          - email
 *          - password
 *        example:
 *          email: "String"
 *          password: 'String'
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
router.post("/login", loginUser);

/**
 * @swagger
 * '/api/user':
 *  put:
 *   summary: Update User Details
 *   tags: [User]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *          $ref: '#/components/schemas/User'
 *   security:
 *     - bearerAuth: []
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

router.put("/", protect, updateUserDetails);

/**
 * @swagger
 * '/api/user/changePassword':
 *  put:
 *   summary: Update User password
 *   tags: [User]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *          $ref: '#/components/schemas/User'
 *   security:
 *     - bearerAuth: []
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

router.put("/changePassword", protect, updateUserPassword);

/**
 * @swagger
 * '/api/user/':
 *  delete:
 *   summary: Delete User account
 *   tags: [User]
 *   security:
 *     - bearerAuth: []
 *   responses:
 *     200:
 *      description: Account Deleted Successfully
 *     400:
 *      description: Invalid Token
 *     500:
 *      description: Server Error
 *
 */

//DELETE: Delete User account

router.delete("/", protect, deleteUserAccount);

module.exports = router;
