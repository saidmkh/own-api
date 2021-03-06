const express = require('express')

const CommentController = require('../controllers/comment')

const router = express.Router()

router.get('/project/:project_id/comments', CommentController.GetComments)
router.post('/user/:user_id/project/:project_id/comment/', CommentController.AddComment)
router.post('/user/:user_id/project/:project_id/comment/:comment_id/reply', CommentController.AddReply)

module.exports = router