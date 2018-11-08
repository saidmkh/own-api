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
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
})

module.exports = mongoose.model('Project', Project)