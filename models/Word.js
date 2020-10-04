const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({

    word: {
        type: String,
        required: true,
        unique: true
    },
    difficulty: {
        type: Number,
        required: true
    }
})

wordSchema.statics.addWord = async function (newWord, newDifficulty) {
    const word = new this()
    word.word = newWord
    word.difficulty = newDifficulty
    await word.save()
    return word
}

const Word = mongoose.model('Word', wordSchema)

module.exports = Word