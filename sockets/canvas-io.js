const { Canvas, canvases } = require('./Canvas')

const colors = require('colors')
if (colors) console.log('canvasIO'.rainbow)

const verbose = false

module.exports = io => { // this takes in the io from the main app/game.js
  const canvas = io.of('/canvas') // the canvas namespace of the io
  canvas.on('connection', socket => {
    console.log('\nconnection on \'/canvas\' namespace'.rainbow)
    socket.on('round start', gameID => {
      // gameID = id from game object in db
      console.log(`\nsomebody joined gameID: ${gameID}`.rainbow)
      socket.join(gameID)
    })

    socket.on('new canvas', data => {
      // data = { gameID, username, word }
      const canvas = new Canvas(data.gameID, data.username, data.word)
      canvases.push(canvas)
    })

    socket.on('drawing', data => {
      // data = { gameID, username, word, pixels }
      socket.to(data.gameID).emit('drawing', data.pixels)
      canvases.filter(canvas => (canvas.gameID === data.gameID && canvas.username === data.username))[0].pixels = data.pixels
    })

    socket.on('disconnect', () => {
      console.log('\nclient disconnected from \'/canvas\' namespace'.magenta)
    })
  })
}
