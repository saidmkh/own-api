const express = require('express')

const UserController = require('../controllers/user')

const router = express.Router()

router.post('/user/:user_id/project/:project_id/comment/:comment_id/like', UserController.Like)
router.post('/user/:user_id/project/:project_id/comment/:comment_id/dislike', UserController.Dislike)

module.exports = router