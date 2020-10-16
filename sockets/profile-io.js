const User = require('../models/User')
const Art = require('../models/Art')
const Word = require('../models/Word')

const colors = require('colors')
if (colors) console.log('profile-io'.rainbow)

module.exports = io => { // this takes in the io from game.js
  const profile = io.of('/profile')

  profile.on('connection', socket => {
    console.log('\nconneciton on \'profile\' namespace'.magenta)

    socket.on('user gallery', async username => {
      const user = await User.findOne({ username })
      // console.log(user)
      await Art.find({ user: user._id })
        .exec(async (err, result) => {
          if (err) return console.log(err)
          await User.populate(result, 'user')
          await Word.populate(result, 'task')
          // console.log(result)
          const gallery = result.map(result => {
            const artwork = {
              username: result.user.username,
              word: result.task.word,
              pixels: result.picture
            }
            return artwork
          })
          // console.log(gallery)
          socket.emit('user gallery', gallery)
        })
    })
  })
}
