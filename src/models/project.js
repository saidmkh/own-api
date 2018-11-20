const mongoose = require('mongoose')

const Comment = require('./comment')

const Schema = mongoose.Schema

const Project = new Schema({
  name: {
    type: String
  },
  data: [{
    type: String
  }],
  comments: [Comment.schema],
})

module.exports = mongoose.model('Project', Project)