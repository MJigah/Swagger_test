const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Order = require("../model/order");
const User = require("../model/user");
const mealDb = require("../seed");

/**
 * @swagger
 * components:
 *   schemas:
 *      Order:
 *        type: object
 *        required:
 *          - userId
 *          - order_item
 *          - order_date
 *          - shipping_address
 *          - payment_method
 *          - payment_result
 *          - tax_price
 *          - shopping_price
 *          - total_price
 *          - is_paid
 *          - paid_at
 *          - is_delivered
 *          - delivered_at
 *        properties:
 *          userId:
 *            type: String
 *            description: The Id of the user
 *          order_item:
 *            type: Object
 *            description: The item of the order
 *          order_date:
 *            type: Date
 *            description: The Date of the order
 *          shipping_address:
 *            type: Object
 *            description: The address to be shipped to
 *          payment_method:
 *            type: String
 *            description: The method of payment
 *          payment_result:
 *            type: Object
 *            description: The result from payment
 *          tax_price:
 *            type: Number
 *            description: The tax price
 *          shopping_price:
 *            type: Number
 *            description: The price of shipping
 *          total_price:
 *            type: Number
 *            description: The total price of shipping
 *          is_paid:
 *            type: Boolean
 *            description: The status of payment
 *          paid_at:
 *            type: Date
 *            description: The date of payment
 *          is_delivered:
 *            type: Boolean
 *            description: The status of delivery
 *          delivered_at:
 *            type: Boolean
 *            description: The date of delivery
 *        example:
 *          userId: '6329d01c7703617f421d1c68'
 *          order_item:
 *            name: Bucket Chicken
 *            quantity: 1
 *            image: './images/image-22.jpg'
 *            price: 5000
 *            meal: '632c62dd9b6ac77bfeae97c0'
 *          order_date: '2022-09-22T13:27:57.500+00:00'
 *          shipping_address:
 *            address: 'No 34A Gabon Crescent, Barnawa, Kaduna'
 *            city: 'Kaduna'
 *            postal_code: 800283
 *          payment_method: Stripe
 *          payment_result:
 *            id: '123abc'
 *            status: 'Unsuccessful'
 *            category: Big man Size
 *            update_time: '2022-09-22T13:27:57.499+00:00'
 *            email_address: 'seedDB@gmail.com'
 *          total_price: 5000
 */

//GET: seed to db
router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const orders = await Order.insertMany(mealDb.orders);
    res.send(orders);
  })
);

/**
 * @swagger
 * '/api/order':
 *  get:
 *   summary: Find all orders
 *   tags: [Order]
 *   responses:
 *     200:
 *      description: The Orders are displayed successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *     500:
 *      description: Server Error
 *
 */

//GET: find all orders
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const allOrders = await Order.find();
    if (!allOrders) {
      throw new Error("No Orders Found!");
    }
    res.send(allOrders);
  })
);

/**
 * @swagger
 * '/api/order/aggregate/{id}':
 *  get:
 *   summary: Find all orders for a particular User
 *   tags: [Order]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The User id
 *   responses:
 *     200:
 *      description: The Orders are displayed Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *     500:
 *      description: Server Error
 *
 */

//GET: find a order by preferences
router.get(
  "/aggregate/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const foundUser = await User.findById(id)
    const foundOrders = await Order.aggregate([
      { $match: { userId: foundUser._id } },
    ]);
    if (!foundOrders) {
      throw new Error("No Orders Found!");
    }
    res.send(foundOrders);
  })
);

/**
 * @swagger
 * '/api/order/{id}':
 *  get:
 *   summary: Get Order by Id
 *   tags: [Order]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Order id
 *   responses:
 *     200:
 *      description: Order Displayed Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Order was not found
 *     500:
 *      description: Server Error
 *
 */

//GET: find a Order by id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const foundOrder = await Order.findById(req.params.id);
    if (!foundOrder) {
      throw new Error("No order found!");
    }
    res.send(foundOrder);
  })
);

/**
 * @swagger
 * '/api/order':
 *  post:
 *   summary: Creating a new Order
 *   tags: [Order]
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Order'
 *   responses:
 *     200:
 *      description: The Order is Created successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *     400:
 *      description: Invalid Order Details
 *     404:
 *      description: The Order was not found
 *     500:
 *      description: Server Error 
 * 
 */
//POST: register a order
router.post('/', asyncHandler(async(req, res) => {
    const newOrder = await Order.create(req.body);
    res.send(newOrder)
}))

/**
 * @swagger
 * '/api/order/{id}':
 *  put:
 *   summary: Update Order details
 *   tags: [Order]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Order id
 *   requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema: 
 *          $ref: '#/components/schemas/Order'
 *   responses:
 *     200:
 *      description: Order updated Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Order was not found
 *     500:
 *      description: Server Error 
 * 
 */
//PUT: update details of an order by id
router.put('/:id', asyncHandler(async(req, res) => {
    const newlyUpdatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body)
    if(!newlyUpdatedOrder){
        throw new Error('No Order found!')
    }
    res.send(newlyUpdatedOrder)
}))

/**
 * @swagger
 * '/api/order/{id}':
 *  delete:
 *   summary: Delete a particular Order
 *   tags: [Order]
 *   parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *          required: true
 *          description: The Order id
 *   responses:
 *     200:
 *      description: Order deleted Successfully
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Order'
 *     400:
 *      description: Invalid Details
 *     404:
 *      description: The Order was not found
 *     500:
 *      description: Server Error 
 */
//DELETE: delete a meal
router.delete('/:id', asyncHandler(async(req, res) => {
    await Order.findByIdAndDelete(req.params.id)
    res.sendStatus(200);
}))

module.exports = router;
