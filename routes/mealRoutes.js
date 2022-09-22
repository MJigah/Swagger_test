const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Meal = require("../model/meal");
const mealDb = require("../seed");

/**
 * @swagger
 * components:
 *   schemas:
 *      Meal:
 *        type: object
 *        required:
 *          - name
 *          - description
 *          - price
 *          - category
 *          - count_in_stock
 *        properties:
 *          name:
 *            type: String
 *            description: The name of the food
 *          description:
 *            type: String
 *            description: The description of the food
 *          price:
 *            type: Number
 *            description: The Price of the food
 *          category:
 *            type: String
 *            description: The category to which the food belongs
 *          count_in_stock:
 *            type: Number
 *            description: The number of food available
 *        example:
 *          name: Pounded Yam and Egusi
 *          description: Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure nam possimus vel, non voluptates ipsum.
 *          price: 500.00
 *          category: Big man Size
 *          count_in_stock: 7
 */

//GET: seed to db
router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const meals = await Meal.insertMany(mealDb.meals);
    res.send(meals);
  })
);

/**
 * @swagger
 * '/api/meals':
 *  get:
 *   summary: Find all meals
 *   tags: [Meal]
 *   responses:
 *     200:
 *      description: The Meal displayed successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Meal'
 *     500:
 *      description: Server Error
 *
 */

//GET: find all meals
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allMeals = await Meal.find();
    if (!allMeals) {
      throw new Error("No Meals Found!");
    }
    res.send(allMeals);
  })
);

/**
 * @swagger
 * '/api/meals/aggregate':
 *  get:
 *   summary: Find all meals within 'Big man size' category
 *   tags: [Meal]
 *   responses:
 *     200:
 *      description: The Meal is displayed Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Meal'
 *     500:
 *      description: Server Error
 *
 */

//GET: find a meal by preferences
router.get(
  "/aggregate",
  asyncHandler(async (req, res) => {
    const foundMeals = await Meal.aggregate([
      { $match: { category: "Big man Size" } },
    ]);
    if (!foundMeals) {
      throw new Error("No Meals Found!");
    }
    res.send(foundMeals);
  })
);

/**
 * @swagger
 * '/api/meals/{id}':
 *  get:
 *   summary: Get Meal by Id
 *   tags: [Meal]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Food id
 *   responses:
 *     200:
 *      description: Food Displayed Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Meal'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Meal was not found
 *     500:
 *      description: Server Error
 *
 */

//GET: find a meal by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const foundMeal = await Meal.findById(req.params.id);
    if (!foundMeal) {
      throw new Error("No meal found!");
    }
    res.send(foundMeal);
  })
);

/**
 * @swagger
 * '/api/meals':
 *  post:
 *   summary: Registering a new Meal
 *   tags: [Meal]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Meal'
 *   responses:
 *     200:
 *      description: The food is successfully registered
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Meal'
 *     400:
 *      description: Invalid Login Details
 *     404:
 *      description: The Meal was not found
 *     500:
 *      description: Server Error 
 * 
 */
//POST: register a meal
router.post('/', asyncHandler(async(req, res) => {
    const newMeal = await Meal.create(req.body);
    res.send(newMeal)
}))

/**
 * @swagger
 * '/api/meals/{id}':
 *  put:
 *   summary: Update Meal details
 *   tags: [Meal]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Meal id
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Meal'
 *   responses:
 *     200:
 *      description: Meal updated Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Meal'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Meal was not found
 *     500:
 *      description: Server Error 
 * 
 */
//PUT: update details of a meal by id
router.put('/:id', asyncHandler(async(req, res) => {
    const newlyUpdatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body)
    if(!newlyUpdatedMeal){
        throw new Error('No Meal found!')
    }
    res.send(newlyUpdatedMeal)
}))

/**
 * @swagger
 * '/api/meals/{id}':
 *  delete:
 *   summary: Delete a particular Meal
 *   tags: [Meal]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Meal id
 *   responses:
 *     200:
 *      description: Meal updated Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Meal'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Meal was not found
 *     500:
 *      description: Server Error 
 */
//DELETE: delete a meal
router.delete('/:id', asyncHandler(async(req, res) => {
    await Meal.findByIdAndDelete(req.params.id)
    res.sendStatus(200);
}))

module.exports = router;
