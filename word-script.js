const fs = require('fs')
const Word = require('./models/Word')
const mongoose = require('mongoose')

module.exports = async function getWords (path){
    let advar = false
    let raw = fs.readFileSync(path)
    let data = JSON.parse(raw)['words']
    console.log('Adding words...')
    for (let i=0;i<data.length;i++){
        await checkWord(data[i].word, data[i].difficulty, async function(word, diff, check){
            if(!check){
                await Word.addWord(word, diff)
            }
            if(i === data.length - 1){
                if(advar)
                    console.log('New word(s) added!')
                else
                    console.log('No new words added.')
            }
        })
    }
}

function checkWord(word, diff, func){
    
    Word.exists({word: word}, function(err, res){
        if(err)
            console.log(err)
        else{
            func(word, diff, res)
            return res
        }
    })
}
