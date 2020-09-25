const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
    
    // Allows for an array of objects of mixed types. This lets us use two dimensional arrays in mongoose.
    picture: {
        type: [mongoose.Schema.Types.Mixed],
        required: true
    }
})

userSchema.statics.signUp = async function (username, password) {
    const user = new this()
    const pic = new Array(50)

    user.username = username

    for(i=0; i< pic.length; i++){
        line = new Array(50)
        line.fill('')
        pic[i] = line
    }

    user.picture = pic
    await user.hashPassword(password)
    await user.save()
    return user
}

userSchema.methods.hashPassword = function (plainText) {
    const user = this
    return bcrypt.hash(plainText, 10).then(hash => {
        user.password = hash
    })
<<<<<<< HEAD
    
  }
  
=======
}

>>>>>>> d902b40d78640736d73b24a4f8f15430e4a63a4e
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password)
}

userSchema.methods.sanitize = function () {
<<<<<<< HEAD
return {
    ...this._doc,
    password: undefined
}
=======
    return {
        ...this._doc,
        password: undefined
    }
>>>>>>> d902b40d78640736d73b24a4f8f15430e4a63a4e
}
  
const User = mongoose.model("User", userSchema)
  
<<<<<<< HEAD
module.exports = User

=======
module.exports = User
>>>>>>> d902b40d78640736d73b24a4f8f15430e4a63a4e
