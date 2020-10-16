const User = require('../models/User')

const colors = require('colors')
if (colors) console.log('profile-io'.rainbow)

module.exports = io => { // this tkes in the io from game.js
  const profile = io.of('/lobby')

  profile.on('connection', socket => {
    console.log('\nconneciton on \'profile\' namespace'.magenta)

    socket.on('user gallery', async username => {
      const user = await User.findOne({ username })
      console.log(user)
    })
  })
}