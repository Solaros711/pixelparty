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
      try {
        const user = await User.findOne({ username })
        // console.log(user)
        await Art.find({ user: user._id })
          .exec(async (err, results) => {
            console.log(results)
            if (err) return console.log(err)

            const checkedResults = results.filter(result => result.task != null && result.user != null)
            // await User.populate(result, 'user')
            await Word.populate(checkedResults, 'task')
            console.log(checkedResults)
            const gallery = checkedResults.map(result => {
              const artwork = {
                username: username,
                word: result.task.word,
                pixels: result.picture
              }
              return artwork
            })
            // console.log(gallery)
            if (gallery.length) socket.emit('user gallery', gallery)
          })
      } catch (err) {
        console.log(err)
      }
    })
  })
}
