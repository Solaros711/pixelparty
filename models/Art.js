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

artSchema.statics.addArt = async function (userID, taskID, newPic) {
  const art = new this()
  art.user = userID
  art.task = taskID
  art.picture = newPic
  console.log(art)
  await art.save()
  return art
}

artSchema.statics.sendArt = async function (canvas){
  let user = null
  let word = null
  await User.find({username: canvas.username}, async function (err, userArg) {
      if(err){
          console.log(err)
      }else{
          user = userArg[0]._id
          await Word.find({word: canvas.word}, async function (err, wordArg) {
              if(err){
                  console.log(err)
              }else{
                  word = wordArg[0]._id
                  await Art.addArt(user, word, canvas.pixels)
              }
          })
      }
  })
}

const Art = mongoose.model('Art', artSchema)

module.exports = Art
