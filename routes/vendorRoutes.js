const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Vendor = require("../model/vendor");
const User = require("../model/user");
const Review = require("../model/review");
const mealDb = require("../seed");
const bcrypt = require('bcryptjs')

/**
 * @swagger
 * components:
 *   schemas:
 *      Vendor :
 *        type: object
 *        required:
 *          - name
 *          - address
 *          - location
 *          - manager
 *          - meals
 *          - review
 *        properties:
 *          name:
 *            type: String
 *            description: The name of the vendor
 *          address:
 *            type: String
 *            description: The address  of a vendor
 *          location:
 *            type: Object
 *            description: The location of a vendor
 *          manager:
 *            type: String
 *            description: The manager of the vendor
 *          meals:
 *            type: Array
 *            description: The meals available of a particular vendor
 *          review:
 *            type: Array
 *            description: The reviews of a particular vendor
 *        example:
 *          name: 'Mr Biggs' 
 *          address: 'Kachia Road, opp. Queen Amina College, Kakuri 800282, Kaduna'
 *          phone_no: '0806 553 9385'
 *          location: {lat: 10.47634278047149, lon: 7.421977446367563}
 *          manager: {name: 'Mr Biggs Manager', password: '12345'}
 *          meals: ['632c62dd9b6ac77bfeae97c0','632c62dd9b6ac77bfeae97bd']
 *          review: ['63346254b1b267ccaaa99b83', '63346252b1b267ccaaa99b81']
 */

//GET: seed to db
router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const reviews = await Vendor.insertMany(mealDb.vendors);
    // await Vendor.deleteMany()
    res.send(reviews);
  })
);

/**
 * @swagger
 * '/api/vendor':
 *  get:
 *   summary: Find all vendors
 *   tags: [Vendor]
 *   responses:
 *     200:
 *      description: The Vendors are displayed successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Vendor'
 *     500:
 *      description: Server Error
 *
 */

//GET: find all reviews
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allVendors = await Vendor.find();
    if (!allVendors) {
      throw new Error("No Vendors Found!");
    }
    res.send(allVendors);
  })
);

/**
 * @swagger
 * '/api/vendor/aggregate/{id}':
 *  get:
 *   summary: Get all reviews for a particular Vendor
 *   tags: [Vendor]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The User id
 *   responses:
 *     200:
 *      description: The Vendors are displayed Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Vendor'
 *     500:
 *      description: Server Error
 *
 */

//GET: find a Vendor by preferences
router.get(
  "/aggregate/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    // const foundUser = await User.findById(id)
    // const foundReviews = await Review.aggregate([
    //   { $match: { userId: foundUser._id } },
    // ]);
    const foundReviews = await Vendor.findById(req.params.id).populate('review')
    if (!foundReviews) {
      throw new Error("No Orders Found!");
    }
    res.send(foundReviews);
  })
);

/**
 * @swagger
 * '/api/vendor/{id}':
 *  get:
 *   summary: Get Vendor by Id
 *   tags: [Vendor]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Vendor id
 *   responses:
 *     200:
 *      description: Vendor Displayed Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Vendor'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Vendor was not found
 *     500:
 *      description: Server Error
 *
 */

//GET: find a Vendor by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const foundVendor = await Vendor.findById(req.params.id);
    if (!foundVendor) {
      throw new Error("No Vendor found!");
    }
    res.send(foundVendor);
  })
);

/**
 * @swagger
 * '/api/vendor':
 *  post:
 *   summary: Creating a new Vendor
 *   tags: [Vendor]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Vendor'
 *   responses:
 *     200:
 *      description: The Vendor is Created successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Vendor'
 *     400:
 *      description: Invalid Vendor Details
 *     404:
 *      description: The Vendor was not found
 *     500:
 *      description: Server Error 
 * 
 */
//POST: register a vendor
router.post('/', asyncHandler(async(req, res) => {
    const password = req.body.manager.password;
    //Generate hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    req.body.manager.password = hashedPassword
    const newRev = req.body.review.map((rev) => {
      const foundRev = Review.findById(rev);
      return foundRev._id
    })
    req.body.review = newRev;
    console.log(req.body)
    const newVendor = await Vendor.create(req.body);
    res.send(newVendor)
}))

/**
 * @swagger
 * '/api/vendor/{id}':
 *  put:
 *   summary: Update Vendor details
 *   tags: [Vendor]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Vendor id
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Vendor'
 *   responses:
 *     200:
 *      description: Vendor updated Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Vendor'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Vendor was not found
 *     500:
 *      description: Server Error 
 * 
 */
//PUT: update details of an vendor by id
router.put('/:id', asyncHandler(async(req, res) => {
    const newlyUpdatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!newlyUpdatedVendor){
        throw new Error('No Vendor found!')
    }
    res.send(newlyUpdatedVendor)
}))

/**
 * @swagger
 * '/api/vendor/{id}':
 *  delete:
 *   summary: Delete a particular Vendor
 *   tags: [Vendor]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Vendor id
 *   responses:
 *     200:
 *      description: Vendor deleted Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Vendor'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Vendor was not found
 *     500:
 *      description: Server Error 
 */
//DELETE: delete a vendor
router.delete('/:id', asyncHandler(async(req, res) => {
    await Vendor.findByIdAndDelete(req.params.id)
    res.sendStatus(200);
}))

module.exports = router;
