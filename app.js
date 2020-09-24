const AuthController = require('./controllers/auth')


module.exports = function (deps) {
  const express = require('express')
  const app = express()

  const http = require('http').createServer(app)
  const io = require('socket.io')(http)

  app.use(express.static('static'))
  app.use(express.json())
  app.use('/', AuthController)

  io.on('connection', (socket) => {
    console.log('connection established')

    socket.on('disconnect', () => {
      console.log('connection ended')
    })
  })

  return http
}
