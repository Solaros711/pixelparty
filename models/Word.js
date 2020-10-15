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

wordSchema.statics.getWords = async function () {
  // let wordsArray = []
  try {
    const words = await Word.find({})//, function (err, result) {
    //   if (err) return console.log(err)
    //   const wordsArray = result.map(word => word.word)
    //   console.log(wordsArray)
    //   return wordsArray
    // })
    const wordsArray = words.map(word => word.word)
    return wordsArray
  } catch (err) {
    console.log(err)
  }
}

const Word = mongoose.model('Word', wordSchema)

module.exports = Word
