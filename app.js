// // file handling library
// const fs = require('fs')
// // start the server
// const http = require('http')
// const port = 3000

// const server = http.createServer(function(req,res){
//     res.writeHead(200, {'Content-Type': 'text/html'})
//     fs.readFile('index.html', function(error,data){
//         if(error){
//             res.writeHead(404)
//             res.write('Error: File Not Found')
//         } else{
//             res.write(data)
//         }
//         res.end()
//     })
// })

// server.listen(port, function(error){
//     if (error){
//         console.log('Something went wrong', error)
//     } else{
//         console.log('Server is listening on port '+ port )
//     }
// })

// Import Libraries
const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const User = require('./model/user')
const port = 4000
const bcrypt = require('bcrypt')
// create an instance of express
const app = express()

async function main () { mongoose.connect('mongodb://localhost:27017/login-app-db',{
    useNewUrlParser:  true,
    useUnifiedTopology: true,
})
}

// Connect to the static folder
app.use('/', express.static(path.join(__dirname, 'static')))

app.use(express.json())

app.post('/api/register', async (req,res) => {
    const {username, password: plainTextPassword } = req.body
    const password = await bcrypt.hash(plainTextPassword,10)
    try { 
        console.log("Hello from the Try Block")
        console.log(username,password)
        const response =  User.create({
            username,
            password
        })
        console.log('User created succesfully', response)
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