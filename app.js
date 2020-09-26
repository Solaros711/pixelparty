const express = require('express')
const morgan = require('morgan')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(morgan('tiny'))

const words = ['dog', 'house', 'tree']

let roles = []
io.on('connection', socket => {
  socket.on('test', () => console.log('test'))
  let word
  console.log('socket connected')
  socket.on('join', (roundId, role) => {
    roles.push(role)
    console.log({ roles })
    socket.join(roundId)
    // console.log({ word })
    let winner = false
    const messages = []

    // this start condition is for testing purposes
    if (roles.length === 2) {
      word = words[Math.floor(Math.random() * words.length)]
      console.log('start', word)
      io.emit('start', role, word)
      let timer = 5
      io.emit('timer', timer)
      const timerID = setInterval(() => {
        if (timer === 0) {
          clearInterval(timerID)
          io.emit('lose')
        }
        io.emit('timer', timer--)
      }, 1000)
    }

    socket.on('drawing', pixels => {
      // console.log('it got here')
      // console.log(pixels)
      io.emit('drawing', pixels)
    })

    socket.on('message', message => {
      console.log({ message, word })
      // console.log(winner)
      if (message.text.toLowerCase() === word.toLowerCase() && !(winner)) {
        console.log('win?')
        io.emit('win', message.user, word)
        winner = true
      }
      messages.push(message)
      io.emit('messages', messages)
    })
  })
  socket.on('disconnect', () => { roles = [] })
})

const startServer = port => {
  http.listen(port)
  console.log(`Server is listening on port ${port}...`)
}

module.exports = { startServer }
