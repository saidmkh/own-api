const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')

const mongoose = require('./config/config')
const authRoute = require('./routes/auth')
const commentRoute = require('./routes/comment')
const userRoute = require('./routes/user')

const app = express()

mongoose.connection.on(
  'error',
  console.error.bind(console, 'Mongo connection failed')
)

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/', function (req, res) {
  res.json({ title: 'API' })
})
app.use('/api/', authRoute)
app.use('/api/', commentRoute)
app.use('/api/', userRoute)

app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  if (err.status === 404) {
    res.status(404).json({ message: 'Not found' })
  } else {
    res.status(500).json({
      error: err,
      message: err.message
    })
  }
})

const PORT = process.env.PORT || 7000
app.listen(PORT, () => console.info(`Server started at ${PORT} port`))