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

      console.log('ppppppppppppppppppppp', req.params.comment_id)

      CommentModel.find({
        comments: {
          $elemMatch: {
            _id: req.params.comment_id
          }
        }
      })
        .then(comment => {
          let reply = new CommentModel({
            content: req.body.content,
            author: comment.author,
            project: comment.project
          })
          console.log('comment', comment)
          console.log('dddd', reply)
          comment[0].comments.unshift(reply)
          comment[0].save().then(comment_save => {
            res.json({ comment_save })
          }).catch(err => {
            res.json({
              error: err
            })
          })
        })
    }
  )
}