const CommentModel = require('../models/comment')
const ProjectModel = require('../models/project')
const UserModel = require('../models/user')

const CommentValidate = require('../_helpers/comment_validate')

module.exports = {
  AddComment: (
    addComment = (req, res) => {
      const { errors, validate } = CommentValidate(req.body)

      if (!validate) {
        return res.status(400).json({ errors })
      }

      let comment = new CommentModel({
        content: req.body.content,
        author: req.params.user_id,
        project: req.params.project_id
      })
      comment.save().then(comment => {
        ProjectModel.findById({ _id: req.params.project_id }).then(Project => {
          Project.comments.unshift(comment)
          Project.save()
        }).catch(err => {
          console.log(err.message)
        })
        UserModel.findById({ _id: req.params.user_id }).then(User => {
          User.comments.unshift(comment)
          User.save()
        }).catch(err => {
          console.log(err.message)
        })
        res.json({ comment })
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
        .populate('comments')
        .then(comments => {
          console.log(comments)
          const findNestedComment = (comment, id) => {
            for (let i = 0; i < comment.length; i++) {
              if (comment[i]._id == id) {
                return comment[i]
              }

              const foundedComment = findNestedComment(comment[i].comments, id)

              if (foundedComment) {
                return foundedComment
              }
            }
          }

          const comment = findNestedComment(comments.comments, comment_id)
          console.log(':::::::-------', comment)
          const Reply = new CommentModel({
            content: req.body.content,
            author: req.params.user_id,
            project: req.params.project_id,
          })

          comment.comments.push(Reply).save()
          comment.save()
            .then(saved => {
              res.json({ saved })
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