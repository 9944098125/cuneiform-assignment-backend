const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoute = require("./routes/auth");
const blogRoute = require("./routes/blogs");

dotenv.config();

// declaring app as express function
const app = express();
// parsing the express data into json format
app.use(express.json());
// using a cors function to carry the backend data frontend
app.use(cors());
// using body parser to parse the data into url encoded
app.use(bodyParser.urlencoded({ extended: false }));
// parsing the data into json format
app.use(bodyParser.json());

// write a function to connect to mongoDB database
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("App connected to MongoDB Database");
  } catch (err) {
    throw err;
  }
}

// if the database gets disconnected
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Database Disconnecting...");
});
// if the database gets re-connected
mongoose.connection.on("connected", () => {
  console.log("MongoDB Database Connecting...");
});

app.use("/api/auth", authRoute);

app.use("/api/blogs", blogRoute);

app.use((err, req, res, next) => {
  const errMessage = err.message || "Something went wrong";
  const errStatus = err.status || 400;
  return res.status(errStatus).json({
    success: false,
    message: errMessage,
    status: errStatus,
    stack: err.stack,
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  connectDB();
  console.log(`App is now connected to port ${port}`);
});

// require('crypto').randomBytes(64).toString('hex')
