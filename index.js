const mongoose = require('mongoose')
const getWords = require('./word-script')

// const port = 8000
// const MESSAGES_PATH = './messages.txt'
const port = process.env.PORT || 8000
const path = 'words.json'

const app = require('./app')()

const connectDatabase = async (hostname, databaseName) => {
    const database = await mongoose.connect(
      `mongodb://${hostname}/${databaseName}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    )
    
  
    console.log(`database connected successfully at mongodb://${hostname}/${databaseName} ...`)
    await getWords(path)
    return database
  }

app.listen(port, async () => {
    await connectDatabase('localhost', 'pixelparty')
    
    console.log(`server listening on port ${port}...`)
  })
