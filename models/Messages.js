const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { ObjectId } = mongoose.Schema.Types


const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    }
})
messageSchema.statics.submitMessage = async function (user, text, room, newDate) {
    const message = new this()
    message.user = user
    message.room = room
    message.text = text
    message.date = newDate
    await message.save()
    return message
  }
const Message = mongoose.model("Message", messageSchema)
  
module.exports = Message