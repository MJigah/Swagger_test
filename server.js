const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const adminRouter = require('./routes/adminRoutes')
const mealRouter = require('./routes/mealRoutes')
const orderRouter = require('./routes/orderRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const userRouter = require('./routes/userRoutes')
const vendorRouter = require('./routes/vendorRoutes')

connectDB()

const PORT = process.env.PORT || 4000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Food API',
            version: '1.0.0', 
            description: 'A simple express Food API'
        },
        servers: [
            {
                url: 'http://localhost:4000/'
            }
        ],
        components: {
            securitySchemes:
            {
                bearerAuth:{
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

const app = express()

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/admin', adminRouter)
app.use('/api/meals', mealRouter)
app.use('/api/order', orderRouter)
app.use('/api/review', reviewRouter)
app.use('/api/user', userRouter)
app.use('/api/vendor', vendorRouter)


// https://afrofoodhub.herokuapp.com/api-docs/

app.listen(PORT, () => console.log(`The Server is running on port ${PORT}`))