const Game = require('./../models/Game')
const colors = require('colors')
if (colors) console.log('game-io'.rainbow)

const verbose = false

module.exports = io => { // this takes in the io from the main app.js
  const lobby = io.of('/lobby')

  lobby.on('connection', socket => { // a client connects to '/lobby' namespace and creates this socket to the server
    console.log('\nconnection on \'/lobby\' namespace'.magenta)

    socket.on('get games', async username => {
      if (verbose) {
        console.log('\n\'get games\' event recieved on \'/lobby\' namespace'.cyan)
        console.log(`\tclient username: ${username}`.yellow)
        console.log('event purpose'.cyan)
        console.log('\t* query database for joinable games\n\t* emit available games to client'.yellow)
      }
      const games = await Game.getJoinable()
      socket.emit('games data', { games })
    })

    socket.on('create game', async data => {
      // data = { username, numOfPlayers=2 (hardcoded on frontend) } custom game options can come in here too
      if (verbose) {
        console.log('\n\'create game\' event recieved on\'/lobby\' namespace'.cyan)
        console.log(`\thost username: ${data.username}`.yellow)
        console.log('event purpose'.cyan)
        console.log('\t* create new game in the database\n\t* emit \'games data\' to update joinable games\n\t* emit \'join created game\' to join host to game'.yellow)
      }

      const gameState = await Game.create(data.username, data.numOfPlayers)
      const games = await Game.getJoinable()
      // have host redirected to join game event
      // data = { gameID, isHost: true }
      lobby.emit('games data', { games })
      if (verbose) {
        console.log('\n\'games data\' event emitted over game namespace'.cyan)
        console.log(`\thost username: ${data.username}\n\tgameID: ${gameState._id}`.yellow)
        console.log('event purpose'.cyan)
        console.log('\t* update frontend state to make game joinable by other clients'.yellow)
      }

      // console.log({ gameID: gameState._id })

      socket.emit('joined game', gameState._id)
    })

    socket.on('join game', async data => {
      // data = { username, gameID } // host doesn't need to join game in db
      if (verbose) {
        console.log('\n\'join game\' event recieved'.cyan)
        console.log(`\tclient username: ${data.username}\n\tgameID: ${data.gameID}`.yellow)
        console.log('event purpose'.cyan)
        console.log('\tif client is not host:\n\t\tjoin client to game in database\n\ttrigger \'join game\' event\n\ttrigger \'game ready\' event if game is full'.yellow)
      }

      const gameState = await Game.join(data.username, data.gameID)

      if (gameState.isReady) {
        gameState.randomize()
        const games = await Game.getJoinable()
        lobby.emit('games data', { games })
      }

      socket.emit('joined game', gameState._id)

      const games = await Game.getJoinable()

      lobby.emit('games data', { games })
    })
    socket.on('disconnect', () => {
      console.log('\nclient disconnected from \'/lobby\' namespace'.magenta)
    })
  })
}
