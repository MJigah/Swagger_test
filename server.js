const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const userRouter = require("./routes/userRoutes");
dotenv.config();

connectDB();

const PORT = process.env.PORT;

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "Simple User Authentication API",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/", swaggerUI.serve, swaggerUI.setup(specs));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//Serve frontend
if (!process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => res.send("Please set production environment"));
}

app.use("/api/user", userRouter);

// https://afrofoodhub.herokuapp.com/api-docs/

app.listen(PORT, () => console.log(`The Server is running on port ${PORT}`));
