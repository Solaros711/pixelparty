const express = require('express')
const morgan = require('morgan')
const { connectDatabase, createRound, joinRound } = require('./round-db')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(morgan('tiny'))

const round = io.of('/round')

const testID = Math.random()

round.on('connection', socket => {
  socket.on('mounted', () => {
    console.log('component mounted')
    round.emit('test id', testID)
  })
  console.log('socket connected on room namespace')

  socket.on('join', (frontendRoundID, username, isHost) => {
    console.log({ frontendRoundID, username, isHost })
    isHost
      ? createRound(frontendRoundID, username, roundDB => {
        if (roundDB.verifyReady()) {
          roundDB.start(frontendRoundID, round, timerID => {
          })
        }
        socket.on('drawing', pixels => {
          round.to(frontendRoundID).emit('drawing', pixels)
        })
        socket.on('message', async message => {
          console.log({ message })
          const messages = await roundDB.logMessage(round, frontendRoundID, message, timerID)
          round.to(frontendRoundID).emit('messages', messages)
        })
      })

      : joinRound(frontendRoundID, username, roundDB => {
        if (roundDB.verifyReady()) {
          roundDB.start(frontendRoundID, round, timerID => {
          })
        }
        socket.on('drawing', pixels => {
          round.to(frontendRoundID).emit('drawing', pixels)
        })
        socket.on('message', async message => {
          console.log({ message })
          const messages = await roundDB.logMessage(round, frontendRoundID, message)
          round.to(frontendRoundID).emit('messages', messages)
        })
      })

    socket.join(frontendRoundID)

    // socket.on('disconnect', () => {
    //   clearInterval(timerID)
    //   players.length = 0
    // })
  })
})

const startServer = port => {
  http.listen(port, async () => {
    await connectDatabase()
    console.log(`Server is listening on port ${port}...`)
  })
}

module.exports = { startServer }
// if (players.length === 2) {
//   const artist = players[Math.floor(Math.random() * players.length)]
//   word = words[Math.floor(Math.random() * words.length)]
//   console.log('start', word)
//   round.to(roundId).emit('start', word, artist)
//   let timer = 30
//   round.to(roundId).emit('timer', timer)
//   timerID = setInterval(() => {
//     if (timer === 0) {
//       clearInterval(timerID)
//       round.to(roundId).emit('lose')
//     }
//     round.to(roundId).emit('timer', timer--)
//   }, 1000)
// }

//   socket.on('message', message => {
//     console.log({ message, word })
//     if (message.text.toLowerCase() === word.toLowerCase() && !(winner)) {
//       clearInterval(timerID)
//       console.log('win?')
//       round.emit('win', message.username, word)
//       winner = true
//     }
//     messages.push(message)
//     round.to(frontendRoundID).emit('messages', messages)
//   })
// socket.on('drawing', pixels => {
//   round.to(frontendRoundID).emit('drawing', pixels)
// })
// })
