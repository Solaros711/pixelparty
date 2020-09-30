const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({

    word: {
        type: String,
        required: true,
        unique: true
    }
})

wordSchema.statics.addWord = async function (newWord) {
    const word = new this()
    word.word = newWord
    await word.save()
    return word
}

const Word = mongoose.model('Word', wordSchema)

module.exports = Word