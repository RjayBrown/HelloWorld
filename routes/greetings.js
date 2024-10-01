const express = require('express')
const router = express.Router()
const homeController = require('../controllers/greetings')

router.get('/', homeController.getGreetings)
router.post('/addGreeting', homeController.addGreeting)
router.put('/updateGreeting', homeController.updateGreeting)
router.put('/addLike', homeController.addLike)
router.delete('/deleteGreeting', homeController.deleteGreeting)

module.exports = router