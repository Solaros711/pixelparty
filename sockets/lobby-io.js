const Game = require('./../models/Game')
const colors = require('colors')
if (colors) console.log('colors'.rainbow)

module.exports = io => { // this takes in the io from the main app.js
  const lobby = io.of('/lobby')

  lobby.on('connection', socket => { // a client connects to '/lobby' namespace and creates this socket to the server
    console.log('\nconnection on \'/lobby\' namespace'.magenta)

    socket.on('get games', async username => {
      console.log('\n\'get games\' event recieved on \'/lobby\' namespace'.cyan)
      console.log(`\tclient username: ${username}`.yellow)
      console.log('event purpose'.cyan)
      console.log('\t* query database for joinable games\n\t* emit available games to client'.yellow)
      const games = await Game.getJoinable()
      socket.emit('games data', { games })
    })

    socket.on('create game', async data => {
      // data = { username, numOfPlayers=2 (hardcoded on frontend) } custom game options can come in here too
      console.log('\n\'create game\' event recieved on\'/lobby\' namespace'.cyan)
      console.log(`\thost username: ${data.username}`.yellow)
      console.log('event purpose'.cyan)
      console.log('\t* create new game in the database\n\t* emit \'games data\' to update joinable games\n\t* emit \'join created game\' to join host to game'.yellow)

      const gameState = await Game.create(data.username, data.numOfPlayers)
      const games = await Game.getJoinable()
      // have host redirected to join game event
      // data = { gameID, isHost: true }
      lobby.emit('games data', { games })
      console.log('\n\'games data\' event emitted over game namespace'.cyan)
      console.log(`\thost username: ${data.username}\n\tgameID: ${gameState._id}`.yellow)
      console.log('event purpose'.cyan)
      console.log('\t* update frontend state to make game joinable by other clients'.yellow)

      console.log({ gameID: gameState._id })

      socket.emit('joined game', gameState._id)
    })

    socket.on('join game', async data => {
      // data = { username, gameID } // host doesn't need to join game in db
      console.log('\n\'join game\' event recieved'.cyan)
      console.log(`\tclient username: ${data.username}\n\tgameID: ${data.gameID}`.yellow)
      console.log('event purpose'.cyan)
      console.log('\tif client is not host:\n\t\tjoin client to game in database\n\ttrigger \'join game\' event\n\ttrigger \'game ready\' event if game is full'.yellow)

      const gameState = await Game.join(data.username, data.gameID)

      if (gameState.isReady) {
        gameState.randomize()
        const games = await Game.getJoinable()
        lobby.emit('games data', { games })
      }

      socket.emit('joined game', gameState._id)

      // console.log(`\nclient username: ${data.username} joined gameID: ${gameDB._id}`.magenta)

      // socket.emit('join game', gameDB._id)
      // console.log('\n\'join game\' event emitted to socket'.cyan)
      // console.log(`\tclient username: ${data.username}\n\tgameID: ${gameDB._id}`.yellow)
      // console.log('event purpose'.cyan)
      // console.log('\t* join client to waiting room on frontend'.yellow)
    })
    socket.on('disconnect', () => {
      console.log('\nclient disconnected from \'/lobby\' namespace'.magenta)
    })
  })
}

// console.log(gameDB)

// socket.join(data.gameID)
// console.log('YOYOYOYOYOYOYOYOYOYOYOYOYOYO'.trap)
// console.log(socket)
// console.log('YOYOYOYOYOYOYOYOYOYOYOYOYOYO'.trap)

// if (gameDB.isReady) {
//   game.emit('game full', gameDB._id)
//   console.log('\n\'game full\' event emitted over game namespace'.cyan)
//   console.log(`\tgameID: ${gameDB._id}\n\tplayers: ${gameDB.players}`.yellow)
//   console.log('event purpose'.cyan)
//   console.log('\t* game can no longer be joined on frontend'.yellow)

//   await gameDB.randomize() // this randomly creates rounds so everybody draws once and everybody gets a different word
//   game.to(data.gameID).emit('game state', gameDB)
//   // console messages needed?

//   game.to(data.gameID).emit('game ready', data.gameID) // emit game start to everyone in room
//   console.log('\n\'game ready\' event emitted over game namespace to game room'.cyan)
//   console.log(`\tgameID: ${data.gameID}\n\tclients: ${gameDB.players}`.yellow)
//   console.log('event purpose'.cyan)
//   console.log('\t* if game is full (gameDB.players === gameDB.numOfPlayers) send ready signal to frontend\n\t* when the host gets this signal, the \'game start\' events will begin'.yellow) // this isn't quite accurate anymore
// }

// socket.emit('join created game', gameDB._id, data.username)
// console.log('\n\'join created game\' event emitted to socket'.cyan)
// console.log(`\thost username: ${data.username}\n\tgameID: ${gameDB._id}`.yellow)
// console.log('\'event purpose:\''.cyan)
// console.log('\t* join host to created game'.yellow)
