const UserModel = require('../models/user')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const argon2 = require('argon2')
const crypto = require('crypto')

const { SignUpValidate, VerifyEmailValidate, SignInValidate } = require('../_helpers/auth_validate')
const secret_key = require('../config/key')
const { transporter, mailOptions } = require('../_helpers/mail_options')

const argon2_options = {
  timeCost: 3,
  memoryCost: 2 ** 12,
  parallelism: 2,
  type: argon2.argon2d
}

module.exports = {
  SignUp: (
    signUp = (req, res) => {
      const { errors, validate } = SignUpValidate(req.body)

      if (!validate) {
        return res.status(400).json({ errors })
      }

      UserModel.find({
        $or: [
          { email: req.body.email },
          { username: req.body.username }
        ]
      })
        .then(FoundedUser => {
          if (FoundedUser.length) {
            if (FoundedUser[0].email === req.body.email) {
              errors.email = 'Email already exist'
              return (
                res.status(400).json({ errors })
              )
            } else if (FoundedUser[0].username === req.body.username) {
              errors.username = 'Username already exist'
              return (
                res.status(400).json({ errors })
              )
            }
          }

          let email_token = crypto.randomBytes(16).toString('hex')

          const User = new UserModel({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            verify_code: email_token
          })

          argon2.hash(User.password, argon2_options)
            .then(hash => {
              User.password = hash
              transporter.sendMail(mailOptions(User.email, User.verify_code),
                function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                }
              )
              User.save()
              res.json({
                status: 'Success',
                message: 'User created',
                data: User
              })
            })
            .catch(err => {
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
  ),

  VerifyEmail: (
    verifyEmail = (req, res) => {
      const { errors, validate } = VerifyEmailValidate(req.body)

      if (!validate) {
        return res.status(400).json({ errors })
      }

      const email = req.body.email
      const verify_code = req.body.verify_code

      UserModel.findOne({ email }).then(User => {
        if (!User) {
          errors.email = 'Email did not match'
          return (
            res.status(400).json({ errors })
          )
        }

        if (User.verify_code !== verify_code) {
          errors.verify_code = 'Verify code not match'
          return (
            res.status(400).json({ errors })
          )
        }

        User.confirmed = true
        User.save()
        const payload = {
          id: User.id,
          email: User.email,
          username: User.username
        }

        jwt.sign(
          payload,
          secret_key,
          {
            expiresIn: '30d'
          },
          (err, token) => {
            if (err) {
              return (
                res.status(400).json({
                  error: err,
                  message: err.message
                })
              )
            }

            res.json({
              success: true,
              token: token,
              data: User
            })
          }
        )
      }).catch(err => {
        res.status(400).json({
          error: err,
          message: err.message
        })
      })
    }
  ),

  SignIn: (
    signIn = (req, res) => {
      const { errors, validate } = SignInValidate(req.body)

      if (!validate) {
        return res.status(400).json(errors)
      }

      const email = req.body.email
      const password = req.body.password

      UserModel.findOne({ email }).then(User => {
        if (!User) {
          errors.email = 'User with this email not found'
          return (
            res.status(400).json(errors)
          )
        }

        if (User.confirmed === false) {
          errors.confirmed = 'Confirm your email'
          return (
            res.status(400).json(errors)
          )
        }

        argon2.verify(User.password, password).then(match => {
          if (!match) {
            errors.password = 'wrong password'
            return (
              res.status(400).json(errors)
            )
          }

          const payload = {
            id: User.id,
            email: User.email,
            username: User.username
          }

          jwt.sign(
            payload,
            secret_key,
            {
              expiresIn: '30d'
            },
            (err, token) => {
              if (err) {
                return (
                  res.status(400).json({
                    error: err,
                    message: err.message
                  })
                )
              }

              res.json({
                success: true,
                token: token,
                data: User
              })
            }
          )
        }).catch(err => {
          res.status(400).json({
            error: err,
            message: err.message
          })
        });
      })
    }
  )
}