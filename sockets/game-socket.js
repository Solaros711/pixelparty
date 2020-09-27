const Game = require('./../models/Game')

const placeholder = () => {}

module.exports = io => { // this takes in the io from the main app.js
  const game = io.of('/game') // the game namespace of the io
  game.on('connection', socket => { // a client connects to '/game' and creates this socket between that client and the server
    socket.on('mounted', () => { // this is leftover from a previous version; probably unnecessary
      // console.log('component mounted')
    })

    socket.on('create game', async data => {
      // data = { username, numOfRounds and/or numOfPlayers }
      console.log('\'create game\' event recieved from client ... this event will:\nOn the backend:\n\tCreate new game in the database\n\tJoin the host client that emitted this event\nOn the frontend:\n\tPut host client in the waiting room\n\tMake game joinable in lobby')
      const game = await Game.create(data.username, data.numOfPlayers)
      // have host redirected to join game event
      // data = { gameID, isHost: true }
      game.emit('game created', game._id)
      socket.emit('join created game', game._id)
    })

    socket.on('join game', async data => {
      // data = { username, gameID, isHost } // host doesn't need to join game in db
      console.log('\'join game\' event recieved from client ... this event will:\nOn the backend:\n\tJoin client to game in the database\nOn the frontend:\n\tPut client in the waiting room\n\tStart game if ready')

      if (data.isHost) { // data is changing here
        data = await Game.find({ _id: data.gameID })
      } else {
        data = await Game.join(data.username, data.gameID)
      }

      socket.join(data.gameID)

      if (data.isReady) {
        await data.randomize()
        /// I'm trying to get this working with line 109 in Game.js Modle
        // game.to(data.gameID).emit('game start', data) emit game start to everyone in room 
      }
    })

    socket.on('message', async data => {
      // data = { gameID, username, text }
      console.log('\'message\' event recieved from client ... this event will:\nOn the backend:\n\tAdd message to the database\n\tCheck for win condition\n\tExecute win functions if necessary\nOn the frontend:\n\tSet state to trigger messages rerender\n\tExecute win functions if necessary')
      const message = { username: data.username, text: data.text }
      const game = await Game.findOne({ _id: data.gameID })
      await game.logMessage(message)
      data = game
      // data = { game state from backend }
      // emit to all clients in room
      game.to(data.gameID).emit('game state', data)
    })

    socket.on('drawing', data => {
      // data = { gameID, pixels }
      console.log('\'drawing\' event recieved from client ... this event will:\nOn the frontend:\n\tDraw pixels on all clients except for artist')
      // emit to all clients in the room except sender
      socket.to(data.gameID).emit('drawing', data.pixels)
    })

    socket.on('start game', data => {
      // data = { gameID }
      console.log('\'start game\' event recieved from client ... this event will:\nI\'m not sure about the organization here... This is a placeholder... The start should come from the backend.  Will handle timer')
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
