const Greeting = require('../models/Greeting')

module.exports = {
    getGreetings: async (req, res) => {
        try {
            const greetings = await Greeting.find()
                .sort({ likes: -1 })
            res.render('index.ejs', { greetings: greetings })
        }
        catch {
            res.json().statusCode = 500
            res.json().statusMessage = 'Server error! Failed to render greetings!'
        }
    },
    addGreeting: async (req, res) => {
        try {
            req.body.likes = 0
            await Greeting.create(req.body)
            console.log(`Added greeting!`)
            res.redirect('/')
        }
        catch {
            res.json().statusCode = 500
            res.json().statusMessage = 'Server error! Failed to add greeting!'
        }
    },
    updateGreeting: async (req, res) => {
        try {
            const selected = Greeting.findOneAndUpdate({ greeting: req.body.greeting })
            if (req.body.newGreetingLikes === undefined) {
                // findOneAndUpdate() args - key for query filter, update, options
                await Greeting.findOneAndUpdate({ greeting: req.body.greeting }, {
                    greeting: req.body.newGreeting,
                    likes: selected.likes
                })
            } else {
                await Greeting.findOneAndUpdate({ greeting: req.body.greeting }, {
                    greeting: req.body.newGreeting,
                    likes: req.body.newGreetingLikes
                })
            }
            res.json().statusCode = 200
            res.json().statusMessage = 'OK'
            console.log('Updated greeting!')
            res.redirect('/')
        }
        catch {
            res.json().statusCode = 500
            res.json().statusMessage = 'Server error! Failed to update greeting!'
        }
    },
    addLike: async (req, res) => {
        try {
            // findOneAndUpdate() args - key for query filter, update, options
            await Greeting
                .findOneAndUpdate({ greeting: req.body.greeting }, {
                    $inc: { likes: 1 }
                })
            res.json().statusCode = 200
            res.json().statusMessage = 'OK'
            console.log('Updated likes')
        }
        catch {
            res.json().statusCode = 500
            res.json().statusMessage = 'Server error! Failed to update likes!'
        }
    },
    deleteGreeting: async (req, res) => {
        try {
            if (req.body.greeting) {
                await Greeting
                    .findOneAndDelete({ greeting: req.body.greeting })
                res.json().statusCode = 200
                res.json().statusMessage = 'OK'
                console.log('Deleted greeting')
            } else {
                console.log('Server error! No greeting to delete!')
            }
        }
        catch {
            res.json().statusCode = 500
            res.json().statusMessage = 'Server error! Failed to delete greeting!'
        }
    }
}