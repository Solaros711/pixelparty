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
<<<<<<< HEAD
      let time = 60
=======
      let time = 10
>>>>>>> 24e5e8d59991d34e0fb787b0ee75cccffcb6ad19
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
