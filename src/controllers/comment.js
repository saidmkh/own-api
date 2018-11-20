const CommentModel = require('../models/comment')
const ProjectModel = require('../models/project')
const UserModel = require('../models/user')

const CommentValidate = require('../_helpers/comment_validate')
const { findNestedComment } = require('../_helpers/functions')

module.exports = {
  AddComment: (
    addComment = (req, res) => {
      const { errors, validate } = CommentValidate(req.body)

      if (!validate) {
        return res.status(400).json({ errors })
      }

      ProjectModel.findById({ _id: req.params.project_id })
        .then(project => {
          const comment = new CommentModel({
            content: req.body.content,
            author: req.params.user_id,
            project: req.params.project_id
          })

          project.comments.unshift(comment)
          project.save()
            .then(comment => {
              UserModel.findById({ _id: req.params.user_id })
                .then(User => {
                  User.comments.unshift(comment)
                  User.save()
                  res.json({
                    status: 'Success',
                    message: 'Comment created',
                    data: comment
                  })
                }).catch(err => {
                  console.log(err.message)
                })
            })
        }).catch(err => {
          res.json({
            error: err,
            message: err.message
          })
        })
    }
  ),

  AddReply: (
    addReply = (req, res) => {
      const { errors, validate } = CommentValidate(req.body)

      if (!validate) {
        return res.status(400).json({ errors })
      }

      const comment_id = req.params.comment_id

      ProjectModel.findById({ _id: req.params.project_id })
        .then(project => {
          const comment = findNestedComment(project.comments, comment_id)

          const Reply = new CommentModel({
            content: req.body.content,
            author: req.params.user_id,
            project: req.params.project_id,
          })

          comment.comments.push(Reply)
          project.markModified('comments');
          project.save()
            .then(data => {
              res.json({
                status: 'Success',
                message: 'Comment created',
                data: data
              })
            }).catch(err => {
              res.json({
                error: err,
                message: err.message
              })
            })
        }).catch(err => {
          res.json({
            error: err,
            message: err.message
          })
        })
    }
  )
}