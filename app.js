const express = require('express')
const morgan = require('morgan')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(morgan('dev'))

io.on('connection', socket => {
  console.log('socket connected')
  socket.on('drawing', pixels => {
    socket.emit('drawing', pixels)
  })
})

const startServer = port => {
  http.listen(port)
  console.log(`Server is listening on port ${port}...`)
}

module.exports = { startServer }
