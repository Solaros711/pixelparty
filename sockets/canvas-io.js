const colors = require('colors')
if (colors) console.log('canvasIO'.rainbow)

module.exports = io => { // this takes in the io from the main app/game.js
  const canvas = io.of('/canvas') // the canvas namespace of the io
  canvas.on('connection', socket => {
    console.log('\nconnection on \'/canvas\' namespace'.rainbow)
    socket.on('round start', gameID => {
      console.log({ gameID })
      // gameID = id from game object in db
      console.log(`somebody joined gameID: ${gameID}`.rainbow)
      socket.join(gameID)
      // console.log('YOYOYOYOYOYOYOYOYOYOYOYOYOYO'.rainbow)
      // console.log(socket)
      // console.log('YOYOYOYOYOYOYOYOYOYOYOYOYOYO'.rainbow)
    })
    socket.on('drawing', data => {
      console.log('somebody\'s drawing'.rainbow)
      console.log({ data })
      // data = { gameID, pixels }c
      socket.to(data.gameID).emit('drawing', data.pixels)
    })
  })
}
