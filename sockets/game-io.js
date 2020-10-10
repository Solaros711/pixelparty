const Game = require('./../models/Game')
const { canvases } = require('./Canvas')
const colors = require('colors')
const Art = require('../models/Art')
if (colors) console.log('gameIO'.rainbow)

Game.clean() // comment in to clean db
const verbose = true

module.exports = io => { // this takes in the io from the main app.js
  const game = io.of('/game') // the game namespace of the io
  game.on('connection', socket => { // a client connects to '/game' and creates this socket between that client and the server
    console.log('\nconnection on \'/game\' namespace'.magenta)
    socket.on('join game', async data => {
      // data = { username, gameID } // host doesn't need to join game in db
      if (verbose) {
        console.log('\n\'join game\' event recieved on\'/game\' namespace'.cyan)
        console.log(`\tclient username: ${data.username}\n\tgameID: ${data.gameID}`.yellow)
        console.log('event purpose'.cyan)
        console.log('\tif client is not host:\n\t\tjoin client to game in database\n\ttrigger \'join game\' event\n\ttrigger \'game ready\' event if game is full'.yellow)
      }

      const gameState = await Game.findOne({ _id: data.gameID })
      socket.join(data.gameID)
      console.log(`\nclient username: ${data.username} joined gameID: ${gameState._id}`.magenta)

      game.to(data.gameID).emit('join game', gameState)
      if (verbose) {
        console.log('\n\'join game\' event emitted to socket'.cyan)
        console.log(`\tclient username: ${data.username}\n\tgameID: ${gameState._id}`.yellow)
        console.log('event purpose'.cyan)
        console.log('\t* join client to waiting room on frontend'.yellow)
      }

      game.to(data.gameID).emit('game state', gameState)
    })

    socket.on('message', async data => {
      // data = { gameID, username, text }
      if (verbose) {
        console.log('\n\'message\' event recieved from client'.cyan)
        console.log(`\tclient username: ${data.username}\n\tgameID: ${data.gameID}\n\tmessage text: ${data.text}`.yellow)
        console.log('event purpose'.cyan)
        console.log('\t* log message to game in database\n\t* check for win condition; alter db accordingly\n\t* emit updated game state to room'.yellow)
      }

      const message = { username: data.username, text: data.text }
      Game.findOne({ _id: data.gameID }, async (err, gameState) => {
        if (err) return console.log(err)
        await gameState.logMessage(message)
        // emit to all clients in room
        game.to(data.gameID).emit('game state', gameState)
      })
    })

    socket.on('time\'s up', gameID => {
      // data = { gameID, currentRound }
      console.log(`\n'time's up' gameID: ${gameID}`.magenta)

      Game.findOne({ _id: gameID }, async (err, gameState) => {
        if (err) return console.log(err)
        const canvas = canvases.filter(canvas => (canvas.gameID === gameState._id.toString() && canvas.username === gameState.rounds[gameState.currentRound].artist))[0]
        await gameState.saveArt(canvas.pixels)
        await Art.sendArt(canvas)
        await gameState.timesUp()
        game.to(gameID).emit('game state', gameState)
      })
    })

    socket.on('next round', gameID => {
      console.log(`'next round' gameID: ${gameID}`.magenta)
      Game.findOne({ _id: gameID }, async (err, gameState) => {
        if (err) return console.log(err)
        await gameState.nextRound()
        game.to(gameID).emit('game state', gameState)
      })
    })

    socket.on('masterpiece', data => {
      // data = { gameID, username, pixels, word }
      if (verbose) {
        console.log('\nA Masterpiece:'.magenta)
        console.log(`"${data.word}", by ${data.username}`.cyan)
        console.log(JSON.stringify(data.pixels).yellow)
      }
    })

    socket.on('disconnect', () => {
      console.log('\nclient disconnected from \'/game\' namespace'.magenta)
    })
  })
}
