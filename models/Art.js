const mongoose = require('mongoose')
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
  const pic = new Array(50)
  for (let i = 0; i < pic.length; i++) {
    const line = new Array(50)
    for (let j = 0; j < line.length; j++) {
      line[j] = newPic[i][j]
    }
    pic[i] = line
  }
  art.user = userID
  art.task = taskID
  art.picture = pic
  await art.save()
  return art
}

const Art = mongoose.model('Art', artSchema)

module.exports = Art
