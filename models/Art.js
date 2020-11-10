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
  word: {
    type: Schema.Types.ObjectId,
    ref: 'Word',
    required: true
  },
  pixels: {
    type: Array,
    required: true
  }
})

artSchema.statics.getRandom = async function (cb) {
  this.aggregate().sample(1)
    .exec(async (err, result) => {
      if (err) return console.log(err)
      await User.populate(result[0], 'user')
      await Word.populate(result[0], 'word')
      const data = { username: result[0].user.username, pixels: result[0].pixels, word: result[0].word.word }
      cb(data)
    })
}

artSchema.statics.addArt = async function (userID, wordID, pixels) {
  const art = new this()
  art.user = userID
  art.word = wordID
  art.pixels = pixels
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

// comment in below to delete empty ArtWork
Art.deleteMany({ picture: Array(50).fill(Array(50)) }, err => {
  if (err) return console.log(err)
})

// comment in to delete all artwork w/ deleted word
// Art.find({}, (err, res) => {
//   if (err) return console.log(err)
//   res.map(async artwork => {
//     await Word.populate(artwork, 'word')
//     console.log(!artwork.word)
//     // if (!artwork.word) {
//     //   Art.deleteOne({ _id: artwork._id }, err => console.log(err))
//     // }
//     // console.log(artwork.word.word)
//   })
// })

// // comment in to update Art model field names
// Art.updateMany({}, { $rename: { picture: 'pixels', task: 'word' } }, (err, raw) => {
//   if (err) return console.log(err)
// })

module.exports = Art
