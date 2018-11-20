const UserModel = require('../models/user')
const ProjectModel = require('../models/project')
const CommentModel = require('../models/comment')

const { findNestedComment } = require('../_helpers/functions')

module.exports = {
  Like: (
    upVote = (req, res) => {
      const project_id = req.params.project_id
      const user_id = req.params.user_id
      const comment_id = req.params.comment_id

      ProjectModel.findById({ _id: project_id })
        .then(project => {
          const comment = findNestedComment(project.comments, comment_id)

          comment.likes.push(user_id)
          project.markModified('comments')
          project.save()
            .then(data => {
              res.json({ data })
            }).catch(err => {
              res.json({
                error: err,
                message: err.message
              })
            })
        })
    }
  ),

  Dislike: (
    downVote = (req, res) => {
      const project_id = req.params.project_id
      const user_id = req.params.user_id
      const comment_id = req.params.comment_id

      ProjectModel.findById({ _id: project_id })
        .then(project => {
          const comment = findNestedComment(project.comments, comment_id)

          comment.dislikes.push(user_id)
          project.markModified('comments')
          project.save()
            .then(data => {
              res.json({ data })
            }).catch(err => {
              res.json({
                error: err,
                message: err.message
              })
            })
        })
    }
  )
}