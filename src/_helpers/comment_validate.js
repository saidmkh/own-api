const isEmpty = require('./empty_valid')

let errors = {}

commentValidate = data => {
  data.body = isEmpty(data.body) ? '' : data.body

  return {
    errors,
    validate: isEmpty(errors)
  }
}

module.exports = commentValidate


