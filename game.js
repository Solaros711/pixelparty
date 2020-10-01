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
// , {
//   handlePreflightRequest: (req, res) => {
//     const headers = {
//       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//       'Access-Control-Allow-Origin': req.headers.origin, // or the specific origin you want to give access to,
//       'Access-Control-Allow-Credentials': true
//     }
//     res.writeHead(200, headers)
//     res.end()
//   }
// })
app.use(morgan('tiny'))
app.use(express.static(path.join(__dirname, 'client-react/build')))
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('reacc/build'))
}

app.get('/', (req, res) => {
  console.log('request')
  console.log(req)
  res.send('hey?')
})
app.use('/', AuthController)
gameIO(io)
canvasIO(io)
timerIo(io)
lobbyIO(io)

const connectDatabase = async (dbName = 'pixel-party', hostname = 'localhost') => {
  console.log('trying to connect')
  const db = await mongoose.connect(
    process.env.MONGODB_URI ||
    `mongodb://${hostname}/${dbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    err => {
      if (err) console.log('db connection error: ', err)
    }
  )
  await getWords(wordsPath)
  console.log(`Database connected at
    ${process.env.MONGODB_URI || `mongodb://${hostname}/${dbName}...`}`)
  return db
}

const startServer = port => {
  http.listen(port, async () => {
    await connectDatabase()
    console.log(`Server is listening on port ${port}...`)
  })
}

module.exports = { startServer }
