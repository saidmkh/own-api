const ProjectModel = require('../models/project')

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

          if (comment.likes.indexOf(user_id) !== -1) {
            return (
              res.status(400).json({
                status: false,
                message: 'User already voted'
              })
            )
          }

          comment.likes.push(user_id)
          project.markModified('comments')
          project.save()
            .then(data => {
              res.json({
                status: 'Success',
                message: 'Like added',
                data: data
              })
            }).catch(err => {
              res.status(400).json({
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

          if (comment.dislikes.indexOf(user_id) !== -1) {
            return (
              res.status(400).json({
                status: false,
                message: 'User already voted'
              })
            )
          }

          comment.dislikes.push(user_id)
          project.markModified('comments')
          project.save()
            .then(data => {
              res.json({
                status: 'Success',
                message: 'Dislike added',
                data: data
              })
            }).catch(err => {
              res.status(400).json({
                error: err,
                message: err.message
              })
            })
        })
    }
  )
}