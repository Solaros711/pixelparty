const express = require('express')
const morgan = require('morgan')
const { connectDatabase, createRound, joinRound } = require('./round-db')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(morgan('tiny'))

const round = io.of('/round')

const testID = Math.random()
const words = ['dog', 'house', 'tree']
// const players = []

round.on('connection', socket => {
  socket.on('mounted', () => {
    round.emit('test id', testID)
  })
  let word
  let timerID
  console.log('socket connected')
  socket.on('join', (frontendRoundID, username, isHost) => {
    isHost
      ? createRound(frontendRoundID, username, round => {
        if (round.verifyReady) console.log('do next thing')
      })
      : joinRound(frontendRoundID, username, round => {
        if (round.verifyReady) console.log('do next thing')
      })
    // players.push(username)
    // console.log({ players })
    socket.join(frontendRoundID)
    // console.log({ word })
    let winner = false
    const messages = []

    // this start condition is for testing purposes
    if (players.length === 2) {
      const artist = players[Math.floor(Math.random() * players.length)]
      word = words[Math.floor(Math.random() * words.length)]
      console.log('start', word)
      round.to(roundId).emit('start', word, artist)
      let timer = 30
      round.to(roundId).emit('timer', timer)
      timerID = setInterval(() => {
        if (timer === 0) {
          clearInterval(timerID)
          round.to(roundId).emit('lose')
        }
        round.to(roundId).emit('timer', timer--)
      }, 1000)
    }

    socket.on('drawing', pixels => {
      round.to(roundId).emit('drawing', pixels)
    })

    socket.on('message', message => {
      console.log({ message, word })
      if (message.text.toLowerCase() === word.toLowerCase() && !(winner)) {
        clearInterval(timerID)
        console.log('win?')
        round.emit('win', message.username, word)
        winner = true
      }
      messages.push(message)
      round.to(roundId).emit('messages', messages)
    })
  })
  socket.on('disconnect', () => {
    clearInterval(timerID)
    players.length = 0
  })
})

const startServer = port => {
  http.listen(port, async () => {
    await connectDatabase()
    console.log(`Server is listening on port ${port}...`)
  })
}

module.exports = { startServer }
