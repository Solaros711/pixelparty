const mongoose = require('mongoose')
const getWords = require('./word-script')

const port = 8000
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
    await getWords(path)
    console.log(`database connected successfully at mongodb://${hostname}/${databaseName} ...`)
    return database
  }

app.listen(port, async () => {
    await connectDatabase('localhost', 'pixelparty')
    console.log(`server listening on port ${port}...`)
  })
