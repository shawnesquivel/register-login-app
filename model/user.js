const mongoose = require('mongoose')

// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const UserSchema = new mongoose.Schema({
    username: {type: String, required:true, unique: true },
    password: {type: String, required:true },
    }, 
    {collection: 'users'}
)

// Convert the schema into a model that we can work with
const model = mongoose.model('UserSchema', UserSchema)

module.exports = model