const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Review = require("../model/review");
const User = require("../model/user");
const mealDb = require("../seed");

/**
 * @swagger
 * components:
 *   schemas:
 *      Review :
 *        type: object
 *        required:
 *          - userId
 *          - comments
 *          - ratings
 *        properties:
 *          userId:
 *            type: String
 *            description: The Id of the user
 *          comments:
 *            type: String
 *            description: The review comments of a particular vendor
 *          ratings:
 *            type: Number
 *            description: The number of ratings of a vendor
 *        example:
 *          userId: '6329d01c7703617f421d1c68'
 *          comments: 'This Store is one of the best in town, really awesome delivery time!!'
 *          ratings: 4.5
 */

//GET: seed to db
router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const reviews = await Review.insertMany(mealDb.reviews);
    res.send(reviews);
  })
);

/**
 * @swagger
 * '/api/review':
 *  get:
 *   summary: Find all orders
 *   tags: [Review]
 *   responses:
 *     200:
 *      description: The Reviews are displayed successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Review'
 *     500:
 *      description: Server Error
 *
 */

//GET: find all reviewa
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allReviews = await Review.find();
    if (!allReviews) {
      throw new Error("No Reviews Found!");
    }
    res.send(allReviews);
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
