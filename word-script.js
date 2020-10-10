const fs = require('fs')
const Word = require('./models/Word')

// Gets the words from a JSON file, and if a specific word is not
// in the database, it will add it to the database.
module.exports = async function getWords (path) {
  const advar = false
  const raw = fs.readFileSync(path)
  const data = JSON.parse(raw).words
  console.log('Adding words...')
  for (let i = 0; i < data.length; i++) {
    await checkWord(data[i].word, data[i].difficulty, async function (word, diff, check) {
      if (!check) {
        await Word.addWord(word, diff)
      }
      if (i === data.length - 1) {
        if (advar) console.log('New word(s) added!')
        else console.log('No new words added.')
      }
    })
  }
}

// Checks to see if the word is in the database, then executes a
// function after it has checked.
function checkWord (word, diff, func) {
  Word.exists({ word: word }, function (err, res) {
    if (err) console.log(err)
    else {
      func(word, diff, res)
      return res
    }
  })
}
