const mongoose = require('mongoose')

const GreetingsSchema = new mongoose.Schema({
    greeting: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Greeting', GreetingsSchema)