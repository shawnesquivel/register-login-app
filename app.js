// Import Libraries
const mongoose = require('mongoose')
const express = require("express")
const path = require('path')
const port = 4000
// create an instance of express
const app = express()
// Hashing
const bcrypt = require('bcrypt')
// An instance of a model is a document
const User = require('./model/user')

// GLOBAL VARIABLES
const SERVER_TIMEOUT_SEC = 30; 
const server = '127.0.0.1:27017'
const database = 'login-app-db'

// Connect to the static folder
app.use('/', express.static(path.join(__dirname, 'static')))

app.use(express.json())

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
            useNewUrlParser:  true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: SERVER_TIMEOUT_SEC*1000
        })
        console.log('Succesfully connected to MongoDB')
    } catch (err){
        console.log('Failed to connect to MongoDB', err)
    }

    }

connectDB();

app.post('/api/register', async (req,res) => {
    const {username, password: plainTextPassword } = req.body
    const password = await bcrypt.hash(plainTextPassword,10)
    try { 
        console.log("Hello from the Try Block")
        console.log(username,password)
        const response = await User.create({
            username,
            password
        })
        console.log('User created succesfully', response, username, password)
    } catch (error) {
        console.log(error)
        return res.json({status: 'error'})
    }

    res.json({status:'ok', message:'new user created'})
})

// For any requests to the root URL, respond with Hello World
app.get("/", async (req,res) => {
    res.send('This is working!')
})

app.listen(port,( ) => {
    console.log(`Listening at http://localhost:${port}`)
})