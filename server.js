const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const userRouter = require('./routes/userRoutes')
const mealRouter = require('./routes/mealRoutes')

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
        ]
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

const app = express()

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/user', userRouter)
app.use('/api/meals', mealRouter)

app.listen(PORT, () => console.log(`The Server is running on port ${PORT}`))