const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const gameIO = require('./sockets/game-socket')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(morgan('tiny'))
gameIO(io)

const connectDatabase = async (dbName = 'pixel-party', hostname = 'localhost') => {
  console.log('trying to connect')
  const db = await mongoose.connect(
    process.env.MONGODB_URI || `mongodb://${hostname}/${dbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    err => {
      if (err) console.log('db connection error: ', err)
    }
  )
  console.log('Database connected at ' + process.env.MONGODB_URI || `mongodb://${hostname}/${dbName}...`)
  return db
}

const startServer = port => {
  http.listen(port, async () => {
    await connectDatabase()
    console.log(`Server is listening on port ${port}...`)
  })
}

module.exports = { startServer }