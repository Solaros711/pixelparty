const mongoose = require('mongoose')
const User = require('./User')
const Word = require('./Word')
const Schema = mongoose.Schema

const artSchema = new mongoose.Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: Schema.Types.ObjectId,
    ref: 'Word',
    required: true
  },
  // Allows for an array of objects of mixed types. This lets us use two dimensional arrays in mongoose.
  picture: {
    type: [Schema.Types.Mixed],
    required: true
  }
})

artSchema.statics.getRandom = async function (cb) {
  this.aggregate().sample(1)
    .exec(async (err, result) => {
      if (err) return console.log(err)
      await User.populate(result[0], 'user')
      await Word.populate(result[0], 'task')
      const data = { username: result[0].user.username, pixels: result[0].picture, word: result[0].task.word }
      cb(data)
    })
}

artSchema.statics.addArt = async function (userID, taskID, newPic) {
  const art = new this()
  art.user = userID
  art.task = taskID
  art.picture = newPic
  await art.save()
  return art
}

artSchema.statics.sendArt = async function (canvas) {
  let user = null
  let word = null
  await User.find({ username: canvas.username }, async function (err, userArg) {
    if (err) {
      console.log(err)
    } else {
      user = userArg[0]._id
      await Word.find({ word: canvas.word }, async function (err, wordArg) {
        if (err) {
          console.log(err)
        } else {
          word = wordArg[0]._id
          await Art.addArt(user, word, canvas.pixels)
        }
      })
    }
  })
}

const Art = mongoose.model('Art', artSchema)

module.exports = Art
