const express = require('express')

const AuthController = require('../controllers/auth')

const router = express.Router()

router.post('/sign-up/', AuthController.SignUp)
router.patch('/verify-email/', AuthController.VerifyEmail)
router.post('/sign-in/', AuthController.SignIn)

module.exports = router