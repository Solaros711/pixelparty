const mongoose = require('mongoose')
const Round = require('./models/Round')

const connectDatabase = async (dbName = 'pixel-party-rounds', hostname = 'localhost') => {
  console.log('trying to connect')
  const db = await mongoose.connect(
    process.env.MONGODB_URI || `mongodb://${hostname}/${dbName}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    },
    err => {
      if (err) console.log('db connection error: ', err)
    }
  )
  console.log('Database connected at ' + process.env.MONGODB_URI || `mongodb://${hostname}/${dbName}...`)
  return db
}

const createRound = async (frontendID, username, cb) => {
  const round = await new Round({
    frontendID: frontendID,
    players: [{ username }]
  })
  round.save()
  cb(round)
}

const joinRound = async (frontendID, username, cb) => {
  const round = await Round.findOne({
    frontendID
  }, err => { if (err) return console.log(err) })
  round.players.push({ username })
  round.save()
  cb(round)
}

module.exports = { connectDatabase, createRound, joinRound }
