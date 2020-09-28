const Game = require('./../models/Game')
const colors = require('colors')
if (colors) {}

module.exports = io => { // this takes in the io from the main app.js
  const game = io.of('/game') // the game namespace of the io
  game.on('connection', socket => { // a client connects to '/game' and creates this socket between that client and the server
    socket.on('mounted', () => { // this is leftover from a previous version; probably unnecessary
      // console.log('component mounted')
    })

    socket.on('create game', async data => {
      // data = { username, numOfRounds and/or numOfPlayers }
      console.log('\n\'create game\' event recieved'.cyan)
      console.log(`\thost username: ${data.username}`.yellow)
      console.log('event purpose'.cyan)
      console.log('\t* create new game in the database\n\t* trigger \'game created\' and \'join created game\' events'.yellow)

      const gameDB = await Game.create(data.username, data.numOfPlayers)
      // have host redirected to join game event
      // data = { gameID, isHost: true }
      game.emit('game created', gameDB._id, data.username)
      console.log('\n\'game created\' event emitted over game namespace'.cyan)
      console.log(`\thost username: ${data.username}\n\tgameID: ${gameDB._id}`.yellow)
      console.log('event purpose'.cyan)
      console.log('\t* make game joinable on frontend by other clients'.yellow)

      socket.emit('join created game', gameDB._id, data.username)
      console.log('\n\'join created game\' event emitted to socket'.cyan)
      console.log(`\thost username: ${data.username}\n\tgameID: ${gameDB._id}`.yellow)
      console.log('\'event purpose:\''.cyan)
      console.log('\t* join host to created game'.yellow)
    })

    socket.on('join game', async data => {
      // data = { username, gameID, isHost } // host doesn't need to join game in db
      console.log('\n\'join game\' event recieved'.cyan)
      console.log(`\tclient username: ${data.username}\n\tgameID: ${data.gameID}\n\tclient isHost: ${data.isHost}`.yellow)
      console.log('event purpose'.cyan)
      console.log('\tif client is not host:\n\t\tjoin client to game in database\n\ttrigger \'join game\' event\n\ttrigger \'game ready\' event if game is full'.yellow)
      let gameDB
      if (data.isHost) {
        gameDB = await Game.findOne({ _id: data.gameID })
      } else {
        gameDB = await Game.join(data.username, data.gameID)
      }

      console.log(gameDB)

      socket.join(data.gameID)
      console.log(`\nclient username: ${data.username} joined gameID: ${gameDB._id}`.magenta)

      game.to(data.gameID).emit('join game', gameDB)
      console.log('\n\'join game\' event emitted to socket'.cyan)
      console.log(`\tclient username: ${data.username}\n\tgameID: ${gameDB._id}`.yellow)
      console.log('event purpose'.cyan)
      console.log('\t* join client to waiting room on frontend'.yellow)

      if (gameDB.isReady) {
        game.emit('game full', gameDB._id)
        console.log('\n\'game full\' event emitted over game namespace'.cyan)
        console.log(`\tgameID: ${gameDB._id}\n\tplayers: ${gameDB.players}`.yellow)
        console.log('event purpose'.cyan)
        console.log('\t* game can no longer be joined on frontend'.yellow)

        await gameDB.randomize() // this randomly creates rounds so everybody draws once and everybody gets a different word
        game.to(data.gameID).emit('game state', gameDB)
        // console messages needed?

        game.to(data.gameID).emit('game ready', data.gameID) // emit game start to everyone in room
        console.log('\n\'game ready\' event emitted over game namespace to game room'.cyan)
        console.log(`\tgameID: ${data.gameID}\n\tclients: ${gameDB.players}`.yellow)
        console.log('event purpose'.cyan)
        console.log('\t* if game is full (gameDB.players === gameDB.numOfPlayers) send ready signal to frontend\n\t* when the host gets this signal, the \'game start\' events will begin'.yellow) // this isn't quite accurate anymore
      }
    })

    socket.on('message', async data => {
      // data = { gameID, username, text }
      console.log('\n\'message\' event recieved from client'.cyan)
      console.log(`\tclient username: ${data.username}\n\tgameID: ${data.gameID}\n\tmessage text: ${data.text}`.yellow)
      console.log('event purpose'.cyan)
      console.log('\t* log message to game in database\n\t* check for win condition; alter db accordingly\n\t* emit updated game state to room'.yellow)
      // console.log('\n\'message\' event recieved from client ... this event will:\nOn the backend:\n\tAdd message to the database\n\tCheck for win condition\n\tExecute win functions if necessary\nOn the frontend:\n\tSet state to trigger messages rerender\n\tExecute win functions if necessary')
      console.log(data)
      const message = { username: data.username, text: data.text }
      Game.findOne({ _id: data.gameID }, async (err, gameDB) => {
        if (err) return console.log(err)
        console.log({ gameDB })
        await gameDB.logMessage(message)
        console.log({ gameDB })
        // data = { game state from backend }
        // emit to all clients in room
        game.to(data.gameID).emit('game state', gameDB)
      })
    })

    socket.on('game start', gameID => {
      // do I need to find the game in the db
      game.to(gameID).emit('game start')
    })

    socket.on('drawing', data => {
      // data = { gameID, pixels }
      console.log('\n\'drawing\' event recieved from client ... this event will:\nOn the frontend:\n\tDraw pixels on all clients except for artist')
      // emit to all clients in the room except sender
      socket.to(data.gameID).emit('drawing', data.pixels)
    })

    socket.on('start game', data => {
      // data = { gameID }
      console.log('\n\'start game\' event recieved from client ... this event will:\nI\'m not sure about the organization here... This is a placeholder... The start should come from the backend.  Will handle timer')
      let timer = 30
      game.to(data.gameID).emit('timer', timer)
      const timerID = setInterval(() => {
        if (timer <= 0) {
          clearInterval(timerID)
          // handle round over in database
        }
        game.to(data.gameID).emit('timer', --timer)
      }, 1000)
    })
  })
}
