const express = require('express')
const morgan = require('morgan')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(morgan('tiny'))

const words = ['dog', 'house', 'tree']

io.on('connection', socket => {
  console.log('socket connected')
  socket.on('round ready', () => {
    const word = words[Math.floor(Math.random() * words.length)]
    console.log({ word })
    let winner = false
    const messages = []

    socket.emit('round start')

    socket.on('drawing', pixels => {
      console.log('it got here')
      console.log(pixels)
      io.emit('drawing', pixels)
    })

    socket.on('message', message => {
      console.log({ message })
      console.log(winner)
      if (message.text.toLowerCase() === word.toLowerCase() && !(winner)) {
        console.log('win?')
        io.emit('win', message.user, word)
        winner = true
      }
      messages.push(message)
      io.emit('messages', messages)
    })
  })
})

const startServer = port => {
  http.listen(port)
  console.log(`Server is listening on port ${port}...`)
}

module.exports = { startServer }
