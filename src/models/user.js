const mongoose = require('mongoose')

const Comment = require('./comment')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    require: true
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    require: true,
  },
  password: {
    type: String,
    require: true
  },
  photo_url: {
    type: String,
    default: null
  },
  verify_code: {
    type: String,
    require: true
  },
  confirmed: {
    type: Boolean,
    default: false,
    require: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

module.exports = mongoose.model('User', UserSchema)