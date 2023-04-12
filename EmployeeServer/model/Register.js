const mongoose  = require('mongoose')

const registerSchema = new mongoose.Schema(
    {
        username : String,
        email    : String,
        phone    : Number,
        position : String,
        salary   : Number
    }
)

const registerModel = mongoose.model(
    "register", registerSchema
)

module.exports = {registerModel}