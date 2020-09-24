const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { ObjectId } = mongoose.Schema.Types


const userSchema = new mongoose.Schema({
    username: {
       type: String,
       required: true,
       unique: true
    },
    password: {
       type: String,
       required: true
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
  
const User = mongoose.model("User", userSchema)
  
module.exports = User

