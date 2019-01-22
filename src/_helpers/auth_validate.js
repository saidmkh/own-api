const isEmpty = require('./empty_valid')

const email_regex = /\S+@\S+/
const username_regex = /^[a-zA-Z0-9.-_$@*!]{3,30}$/
let errors = {}

module.exports = {
  SignUpValidate: (
    signUpValidate = data => {
      data.email = isEmpty(data.email) ? '' : data.email
      data.username = isEmpty(data.username) ? '' : data.username
      data.password = isEmpty(data.password) ? '' : data.password
      data.repeat_password = isEmpty(data.repeat_password) ? '' : data.repeat_password

      if (!data.email.match(email_regex)) {
        errors.email = 'email is not valide'
      }

      if (!data.username.match(username_regex)) {
        errors.username = 'username lengh must be between 3-30 and use username standarts'
      }

      if (data.password.length < 6 && data.password.length > 50) {
        errors.password = 'password length must be between 6-50'
      }

      return {
        errors,
        validate: isEmpty(errors)
      }
    }
  ),

  VerifyEmailValidate: (
    verifyEmailValidate = data => {
      data.email = isEmpty(data.email) ? '' : data.email

      if (!data.email.match(email_regex)) {
        errors.email = 'email is not valide'
      }

      if (!data.verify_code.length) {
        errors.verify_code = 'Please, enter the verify code'
      }

      return {
        errors,
        validate: isEmpty(errors)
      }
    }
  ),

  SignInValidate: (
    signInValidate = data => {
      data.email = isEmpty(data.email) ? '' : data.email
      data.password = isEmpty(data.password) ? '' : data.password

      if (!data.email.match(email_regex)) {
        errors.email = 'email is not valide'
      }

      if (data.password.length < 6 && data.password.length > 50) {
        errors.password = 'password length must be between 6-50'
      }

      return {
        errors,
        validate: isEmpty(errors)
      }
    }
  )
}


