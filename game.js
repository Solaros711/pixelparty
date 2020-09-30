const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const gameIO = require('./sockets/game-io')
const canvasIO = require('./sockets/canvas-io')
const timerIo = require('./sockets/timer-io')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(morgan('tiny'))
gameIO(io)
canvasIO(io)
timerIo(io)

const connectDatabase = async (dbName = 'pixel-party', hostname = 'localhost') => {
  console.log('trying to connect')
  const db = await mongoose.connect(`mongodb://${hostname}/${dbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    err => {
      if (err) console.log('db connection error: ', err)
    }
  )
  console.log(`Database connected at 'mongodb://${hostname}/${dbName}...`)
  return db
}

const startServer = port => {
  http.listen(port, async () => {
    await connectDatabase()
    console.log(`Server is listening on port ${port}...`)
  })
}

module.exports = { startServer }