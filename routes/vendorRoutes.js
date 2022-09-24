const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Vendor = require("../model/vendor");
const User = require("../model/user");
const mealDb = require("../seed");

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
 *          review: ['632f4698349a60426d5fe016', '632f438f0f284b7df3370155']
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

//GET: find all reviewa
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
 * '/api/review/aggregate/{id}':
 *  get:
 *   summary: Find all reviews from a particular User
 *   tags: [Review]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The User id
 *   responses:
 *     200:
 *      description: The Reviews are displayed Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Review'
 *     500:
 *      description: Server Error
 *
 */

//GET: find a review by preferences
router.get(
  "/aggregate/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const foundUser = await User.findById(id)
    const foundReviews = await Review.aggregate([
      { $match: { userId: foundUser._id } },
    ]);
    if (!foundReviews) {
      throw new Error("No Orders Found!");
    }
    res.send(foundReviews);
  })
);

/**
 * @swagger
 * '/api/review/{id}':
 *  get:
 *   summary: Get Review by Id
 *   tags: [Review]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Review id
 *   responses:
 *     200:
 *      description: Review Displayed Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Review'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Review was not found
 *     500:
 *      description: Server Error
 *
 */

//GET: find a Review by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const foundReview = await Review.findById(req.params.id);
    if (!foundReview) {
      throw new Error("No Review found!");
    }
    res.send(foundReview);
  })
);

/**
 * @swagger
 * '/api/review':
 *  post:
 *   summary: Creating a new Review
 *   tags: [Review]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Review'
 *   responses:
 *     200:
 *      description: The Review is Created successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Review'
 *     400:
 *      description: Invalid Review Details
 *     404:
 *      description: The Review was not found
 *     500:
 *      description: Server Error 
 * 
 */
//POST: register a review
router.post('/', asyncHandler(async(req, res) => {
    const newReview = await Review.create(req.body);
    res.send(newReview)
}))

/**
 * @swagger
 * '/api/review/{id}':
 *  put:
 *   summary: Update Review details
 *   tags: [Review]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Review id
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Review'
 *   responses:
 *     200:
 *      description: Review updated Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Review'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Review was not found
 *     500:
 *      description: Server Error 
 * 
 */
//PUT: update details of an review by id
router.put('/:id', asyncHandler(async(req, res) => {
    const newlyUpdatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if(!newlyUpdatedReview){
        throw new Error('No Review found!')
    }
    res.send(newlyUpdatedReview)
}))

/**
 * @swagger
 * '/api/review/{id}':
 *  delete:
 *   summary: Delete a particular Review
 *   tags: [Review]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Review id
 *   responses:
 *     200:
 *      description: Review deleted Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Review'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Review was not found
 *     500:
 *      description: Server Error 
 */
//DELETE: delete a review
router.delete('/:id', asyncHandler(async(req, res) => {
    await Review.findByIdAndDelete(req.params.id)
    res.sendStatus(200);
}))

module.exports = router;
