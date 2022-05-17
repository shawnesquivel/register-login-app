// Import Libraries
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const port = 4000;
// create an instance of express
const app = express();
// Hashing
const bcrypt = require("bcrypt");
// An instance of a model is a document
const User = require("./model/user");

// GLOBAL VARIABLES
const SERVER_TIMEOUT_SEC = 30;
const server = "127.0.0.1:27017";
const database = "login-app-db";

// Connect to the static folder
app.use("/", express.static(path.join(__dirname, "static")));

app.use(express.json());

// 1a Connect to database with Promises
// mongoose.connect(`mongodb://${server}/${database}`,{
//     useNewUrlParser:  true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: SERVER_TIMEOUT_SEC*1000
// }).then( () => {
//     console.log('Succesfully connected to MongoDB')
// }).catch(err => {
//     console.log('Failed to connect to MongoDB')
// })

// 1b Connect ot database with Async/Await
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${server}/${database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: SERVER_TIMEOUT_SEC * 1000,
    });
    console.log("Succesfully connected to MongoDB");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
};

connectDB();

// Database Operations - CRUD = Database, ReST (get, post, put, delete) = HTTP (clients/servers)

// Login API Endpoint - Authorization
app.post("/api/login", async (req,res) => {
  res.json({status: "ok", data:"abcdefg12345"})
})

// Registration API Endpoint - POST REQUEST - Authentication
app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);

  // Error Message Handling
  
  if (!username || typeof username !== "string"){
      return res.json({status: "error", error: "Invalid username"})
  }
    //  Use the plain text password, otherwise you will get async inconsistencies
  if (!plainTextPassword || typeof plainTextPassword !== "string"){
      return res.json({status: "error", error: "Invalid password!"})
  }

  if (plainTextPassword.length < 5) {
      return res.json ({
          status:'error',
          error: "Password is too short, please use at least 6 characters!"
      })
  }

  try {
    const response = await User.create({
      username,
      password,
    });
    console.log("User created succesfully", response, username, password);
  } catch (error) {
    // console.log(JSON.stringify(error))
    if (error.code === 11000) {
      // duplicate username key
      return res.json({
        status: "error",
        error: `The username "${username}" is already in use, please choose another!`,
      });
    }
    throw error;
  }

  res.json({ status: "ok", error: "new user created" });
});

// For any requests to the root URL, respond with Hello World
app.get("/", async (req, res) => {
  res.send("This is working!");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
