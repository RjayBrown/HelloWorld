const express = require('express')
const app = express()
const connectDB = require('./config/database')
const homeRoutes = require('./routes/greetings')

require('dotenv').config({ path: './config/.env' })

// DATABASE CONNECTION
connectDB()

// VIEWS
app.set('view engine', 'ejs')
app.use(express.static('public'))

// MIIDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ROUTERS
app.use('/', homeRoutes)

// PORT
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})