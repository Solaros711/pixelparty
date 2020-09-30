// import controllers
const AuthController = require('./controllers/auth')
const GetController = require('./controllers/get-messages')
const Message = require('./models/Messages')
const { userInfo } = require('os')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const path = require('path')

module.exports = function (deps) {
  const express = require('express')

  const app = express()

  app.use(express.static(path.join(__dirname, 'client-react/build')))
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client-react/build', 'index.html'))
  })

  app.use(express.json())
  app.use('/', AuthController)
  app.use('/', GetController)

  const http = require('http').createServer(app)
  const io = require('socket.io')(http)

  io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('chat message', (msg) => {
      try {
        if (jwt.verify(msg.userId, 'CHANGEME!')) {
          const user = jwt.decode(msg.userId, 'CHANGEME!')
          const newDate = new Date()
          User.findOne({ _id: user._id }, async (err, person) => {
            const formattedMsg = {user: {username: person.username}, text: msg.text, room: msg.room, date: newDate} 
            console.log(formattedMsg)
            io.emit('chat message', formattedMsg)
          })
          Message.submitMessage(user._id, msg.text, msg.room, newDate)
        } else {
          console.log('json web token failed')
        }
        
      } catch(err) {
        console.log(err)
      }
    })

    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
  })

  return http
}
