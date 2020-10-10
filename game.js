const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const path = require('path')

const AuthController = require('./controllers/auth')

const gameIO = require('./sockets/game-io')
const canvasIO = require('./sockets/canvas-io')
const timerIo = require('./sockets/timer-io')
const lobbyIO = require('./sockets/lobby-io')
const getWords = require('./word-script')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const wordsPath = './words.json'

app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, 'client-react/build')))
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('reacc/build'))
}

app.use(express.json())
app.use('/', AuthController)
gameIO(io)
canvasIO(io)
timerIo(io)
lobbyIO(io)

const connectDatabase = async (dbName = 'pixel-party', hostname = 'localhost') => {
  console.log('Connecting to database...')
  const db = await mongoose.connect(
    process.env.MONGODB_URI ||
    `mongodb://${hostname}/${dbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    err => {
      if (err) return console.log('Database Connection Error: ', err)
    }
  )
  await getWords(wordsPath)
  // how to get this message to log in the right circumstances?
  if (db) console.log(`Database connected at ${process.env.MONGODB_URI || `mongodb://${hostname}/${dbName}...`}`)
  return db
}

const startServer = port => {
  http.listen(port, async () => {
    await connectDatabase()
    console.log(`Server is listening on port ${port}...`)
  })
}

module.exports = { startServer }
