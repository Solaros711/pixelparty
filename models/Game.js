const mongoose = require('mongoose')
const colors = require('colors')

const { Schema } = mongoose

const Word = require('./Word')
const Art = require('./Art')
const User = require('./User')

if (colors) {}
const verbose = false

const roundSchema = new Schema({
  word: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  winner: {
    type: String,
    required: false
  },
  roundOver: {
    type: Boolean,
    default: false
  },
  masterpiece: {
    type: Array,
    default: []
  }
})

const messageSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  winner: {
    type: Boolean,
    required: false
  }
})

const gameSchema = new Schema({
  rounds: [roundSchema],
  messages: [messageSchema],
  players: { // later, this can be a relation to the User model [userSchema] or virtual
    type: Array,
    required: true,
    default: []
  },
  numOfRounds: {
    type: Number,
    required: true
  },
  numOfPlayers: {
    type: Number,
    required: true
  },
  isReady: {
    type: Boolean,
    default: false
  },
  currentRound: {
    type: Number,
    default: 0
  },
  points: {
    type: Array,
    default: []
  },
  host: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: new Date()
  },
  joinable: { // maybe change to public later
    type: Boolean,
    required: true,
    default: true
  },
  gameOver: {
    type: Boolean,
    required: true,
    default: false
  }
})

gameSchema.statics.create = async function (hostUsername, numOfPlayers) {
  if (verbose) console.log('create start')
  const game = new this()
  game.host = hostUsername
  game.players = [hostUsername]
  // numOfPlayers = numOfRounds for now
  game.numOfPlayers = numOfPlayers
  game.numOfRounds = numOfPlayers
  await game.save()
  if (verbose) console.log('create end')
  return game
}

gameSchema.statics.join = async function (username, gameID) {
  if (verbose) console.log('join')
  const game = await this.findOne({ _id: gameID }, err => { if (err) { return console.log(err) } })
  game.players.push(username)
  if (game.players.length === game.numOfPlayers) {
    game.isReady = true
    game.joinable = false
  }
  await game.save()
  return game
}

gameSchema.statics.getJoinable = async function () {
  const games = await this.find({ joinable: true })
  if (verbose) console.log('rainbow'.rainbow)
  if (verbose) console.log({ games })
  return games
}

gameSchema.statics.clean = async function () {
  await this.deleteMany({})
}

gameSchema.methods.randomize = async function () {
  try {
    const players = this.players.slice()
    let artist
    let words = await Word.getWords()
    console.log(words)
    words = words.slice()
    let word
    while (players.length) {
      artist = players.sort((_a, _b) => Math.random() - 0.5).splice(0, 1)[0]
      word = words.sort((_a, _b) => Math.random() - 0.5).splice(0, 1)[0]
      this.rounds.push({ word, artist })
    }
    await this.save()
    return this
  } catch (err) {
    console.log(err)
  }
}

gameSchema.methods.logMessage = async function (message) {
  if (this.isReady) {
    const round = this.rounds[this.currentRound]
    if (message.text.toLowerCase() === round.word.toLowerCase() && !round.roundOver) {
      if (!round.winner) {
        round.winner = message.username
        message.winner = true
        this.points.push(round.winner, round.artist)
      }
    }
  }
  this.messages.push(message)
  await this.save()
  if (verbose) console.log('log message: '.rainbow, this)
  return this
}

gameSchema.methods.endRound = async function (canvas) {
  try {
    await this.saveArt(canvas.pixels)
    await Art.sendArt(canvas)
    await this.timesUp()
  } catch (err) {
    console.log(err)
  }
}

gameSchema.methods.nextRound = async function () {
  // trigger game state data for starting the next round
  this.currentRound++
  // if (this.currentRound === this.rounds.length) {
  //   this.gameOver = true
  // }
  await this.save()
  if (verbose) console.log('next round: '.rainbow, this)
  return this
}

gameSchema.methods.timesUp = async function () {
  const round = this.rounds[this.currentRound]
  round.roundOver = true
  await this.save()
  if (verbose) console.log('time\'s up: '.rainbow, this)
  return this
}

gameSchema.methods.endGame = async function () {
  this.gameOver = true
  this.awardPixels()
  await this.save()
  return this
}

gameSchema.methods.awardPixels = async function () {
  const score = this.points.reduce((pointsObject, name) => {
    if (name in pointsObject) pointsObject[name]++
    else pointsObject[name] = 1
    return pointsObject
  }, {})
  User.awardPixels(score)
  // const pixelsToBeAwarded = this.points.concat(this.players)
  // pixelsToBeAwarded.forEach(async username => {
  //   await User.awardPixel(username)
  // })
  // pixelsToBeAwarded.map(async username => {
  //   console.log(username)
  //   await User.awardPixel(username)
  // })
  // await this.points.map(async username => await User.givePixel(username))
  // await this.players.map(async username => await User.givePixel(username))
}

gameSchema.methods.saveArt = async function (pixels) {
  const round = this.rounds[this.currentRound]
  round.masterpiece = pixels
  await this.save()
}

module.exports = mongoose.model('Game', gameSchema)
