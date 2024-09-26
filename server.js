/* EXPRESS FRAMEWORK */
const express = require('express')
const app = express()
require('dotenv').config()

/* MIDDLEWARE */

// Handle cors
const cors = require('cors')
app.use(cors())

// Handle JSON
app.use(express.json())

// Set up views
app.set('view-engine', 'ejs')
app.use(express.static('public'))

// Enable form handling
app.use(express.urlencoded({ extended: true }))



/* DATABASE | SERVER */

const MongoClient = require('mongodb').MongoClient

// Connect to database on page load
connectToDb()

async function connectToDb() {
    try {
        const client = await MongoClient.connect(process.env.DB_STRING)
        console.log('Connected to database!')

        const db = client.db(process.env.DB_NAME)
        const greetingsCollection = db.collection('greetings')


        // API - endpoint to access the entire greeting list
        app.get('/api', async (req, res) => {
            try {
                const greetings = await greetingsCollection.find().toArray()
                const greetingsObj = {}

                for (let i = 0; i < greetings.length; i++) {
                    let key = greetings[i].greeting.toLowerCase().split(' ').join('-')
                    greetingsObj[key] = greetings[i]
                }

                res.json(greetingsObj)
            }
            catch {
                res.json().statusCode = 500
                res.json().statusMessage = 'Server error! Failed to retrieve greetings list!'
            }
        })

        // API - endpoint to access specific greetings
        app.get('/api/:greeting', async (req, res) => {
            try {
                const greetings = await greetingsCollection.find().toArray()
                const greetingsObj = {}
                const empty = "Greeting does not exist!"

                const greeting = req.params.greeting.toLowerCase().split(' ').join('-')

                for (let i = 0; i < greetings.length; i++) {
                    let key = greetings[i].greeting.toLowerCase().split(' ').join('-')
                    greetingsObj[key] = greetings[i]
                }

                if (greetingsObj[greeting]) {
                    res.json(greetingsObj[greeting])
                } else {
                    res.json(empty)
                }
            }
            catch {
                res.json().statusCode = 500
                res.json().statusMessage = 'Server error! Failed to retrieve greeting!'
            }
        })

        /* CRUD OPERATIONS */

        // READ - render main page with greetings list
        app.get('/', async (req, res) => {
            try {
                const greetings = await greetingsCollection
                    .find()
                    .sort({ likes: -1 })
                    .toArray()
                res.render('index.ejs', { greetings: greetings })
            }
            catch {
                res.json().statusCode = 500
                res.json().statusMessage = 'Server error! Failed to render greetings!'
            }
        })

        // CREATE - add greeting
        app.post('/greetings', (req, res) => {
            try {
                req.body.likes = 0
                greetingsCollection.insertOne(req.body)
                console.log(`Added greeting!`)
                res.redirect('/')
            }
            catch {
                res.json().statusCode = 500
                res.json().statusMessage = 'Server error! Failed to add greeting!'
            }
        })

        // UPDATE - change greeting
        app.put('/greetings', async (req, res) => {
            try {
                const selected = await greetingsCollection.findOne({ greeting: req.body.greeting })
                if (req.body.newGreetingLikes === undefined) {
                    greetingsCollection
                        // findOneAndUpdate() args - { key: value } for query filter, update, options
                        .findOneAndUpdate({ greeting: req.body.greeting }, {
                            $set: {
                                greeting: req.body.newGreeting,
                                likes: selected.likes
                            },
                        }
                        )
                } else {
                    greetingsCollection
                        // findOneAndUpdate() args - { key: value } for query filter, update, options
                        .findOneAndUpdate({ greeting: req.body.greeting }, {
                            $set: {
                                greeting: req.body.newGreeting,
                                likes: req.body.newGreetingLikes
                            },
                        }
                        )
                }
                res.json().statusCode = 200
                res.json().statusMessage = 'OK'
                console.log('Updated greeting!')
            }
            catch {
                res.json().statusCode = 500
                res.json().statusMessage = 'Server error! Failed to update greeting!'
            }
        })

        // UPDATE increase like count
        app.put('/likes', async (req, res) => {
            try {
                await greetingsCollection
                    // findOneAndUpdate() args - key for query filter, update, options
                    .findOneAndUpdate({ greeting: req.body.greeting }, {
                        $inc: {
                            likes: 1
                        },
                    }
                    )
                res.json().statusCode = 200
                res.json().statusMessage = 'OK'
                console.log('Updated likes')
            }
            catch {
                res.json().statusCode = 500
                res.json().statusMessage = 'Server error! Failed to update likes!'
            }
        })

        // DELETE - remove greeting
        app.delete('/greetings', (req, res) => {
            try {
                if (req.body.greeting) {
                    greetingsCollection
                        .deleteOne({ greeting: req.body.greeting })
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
        })
    }
    catch {
        console.log('Failed to connect to database!')
    }
}

// set port for server
const PORT = process.env.PORT || 8000

// allow cloud hosting to set port or use local host
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
