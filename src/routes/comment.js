const express = require('express')

const CommentController = require('../controllers/comment')

const router = express.Router()

router.post('/comment/:project_id/:user_id/', CommentController.AddComment)
router.patch('/comment/reply/:comment_id', CommentController.AddReply)

module.exports = router