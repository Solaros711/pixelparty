const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  picture: {
    type: Schema.Types.ObjectId,
    ref: 'Art',
    required: false
  },
  pixelPoints: {
    type: Number,
    default: 0
  }
})

userSchema.statics.signUp = async function (username, password) {
  const user = new this()
  user.username = username
  await user.hashPassword(password)
  await user.save()
  return user
}

userSchema.methods.hashPassword = function (plainText) {
  const user = this
  return bcrypt.hash(plainText, 10).then(hash => {
    user.password = hash
  })
}

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password)
}

userSchema.methods.sanitize = function () {
  return {
    ...this._doc,
    password: undefined
  }
}

userSchema.methods.addPic = async function (picID) {
  const user = this
  user.picture = picID
  await user.save()
  return user
}

userSchema.statics.givePixel = function (username) {
  this.findOne({ username: username }, async (err, user) => {
    if (err) return console.log(err)
    user.pixelPoints += 1
    await user.save()
  })
}

const User = mongoose.model('User', userSchema)

module.exports = User
