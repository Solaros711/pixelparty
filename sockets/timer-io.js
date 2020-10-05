const colors = require('colors')
if (colors) console.log('timerIO'.rainbow)

const verbose = false

module.exports = io => { // this will take io from the main app
  const timer = io.of('/timer') // timer namespace of the io
  timer.on('connection', socket => {
    console.log('\nconnection on \'/timer\' namespace'.cyan)

    socket.on('round join', gameID => {
      console.log(`round join ${gameID}`)
      socket.join(gameID)
    })

    socket.on('round start', gameID => {
      // data = { gameID, isHost }
      console.log(`round start ${gameID}`)
      let time = 5
      timer.to(gameID).emit('timer', time)
      const id = setInterval(() => {
        timer.to(gameID).emit('timer', --time)
        if (time <= 0) {
          socket.emit('time\'s up', gameID)
          clearInterval(id)
        }
      }, 1000)
    })

    socket.on('disconnect', () => {
      console.log('\nclient disconnected from \'/timer\' namespace'.magenta)
    })
  })
}
