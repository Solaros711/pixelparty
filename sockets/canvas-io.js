const colors = require('colors')
if (colors) console.log('canvasIO'.rainbow)

const verbose = false

module.exports = io => { // this takes in the io from the main app/game.js
  const canvas = io.of('/canvas') // the canvas namespace of the io
  canvas.on('connection', socket => {
    console.log('\nconnection on \'/canvas\' namespace'.rainbow)
    socket.on('round start', gameID => {
      // console.log({ gameID })
      // gameID = id from game object in db
      console.log(`\nsomebody joined gameID: ${gameID}`.rainbow)
      socket.join(gameID)
    })

    socket.on('drawing', data => {
      // console.log('somebody\'s drawing'.rainbow)
      // console.log({ data })
      // data = { gameID, pixels }
      socket.to(data.gameID).emit('drawing', data.pixels)
    })

    socket.on('disconnect', () => {
      console.log('\nclient disconnected from \'/canvas\' namespace'.magenta)
    })
  })
}
