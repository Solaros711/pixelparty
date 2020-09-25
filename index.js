const mongoose = require('mongoose')

// const port = 8000
// const MESSAGES_PATH = './messages.txt'
const port = process.env.PORT || 8000

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
    return database
  }

app.listen(port, async () => {
<<<<<<< HEAD
    await connectDatabase('localhost', 'message-db')
    console.log(`server listening on port ${port}...`)
  })

console.log('server listening on port:', port)
=======
    await connectDatabase('localhost', 'pixelparty')
    console.log(`server listening on port ${port}...`)
  })
>>>>>>> d902b40d78640736d73b24a4f8f15430e4a63a4e
