// import controllers
const AuthController = require('./controllers/auth')

module.exports = function (deps) {
  const express = require('express')

  const app = express()

  // We don't need this until we're preparing to depoly
  // app.use(express.static(path.join(__dirname, 'client-react/build')))
  // app.get('/*', function (req, res) {
  //   res.sendFile(path.join(__dirname, 'client-react/build', 'index.html'))
  // })

  app.use(express.json())
  app.use('/', AuthController)

  const http = require('http').createServer(app)
  const io = require('socket.io')(http)

  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  return http
}
