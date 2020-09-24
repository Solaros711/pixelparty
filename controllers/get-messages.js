const express = require('express')
const fs = require('fs')
const Messages = require('../models/Messages')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')


router.get('/messages', (req, res) => {
  const authorization = req.header('Authorization') || ''
  const [type, token] = authorization.split(' ')
  console.log("inside get-messages.js")
  if (type === 'Bearer' && jwt.verify(token, 'CHANGEME!')) {
    const payload = jwt.decode(token, 'CHANGEME!')
    User.findOne({ _id: payload._id }, (err, user) => {
      if (err) return res.status(500).send(err)

      // do something with user
    Messages.find({}).populate('user', 'username').exec((err, messages) => {
      if (err) return res.status(500).send(err)
      console.log(messages)
      return res.json(messages)
    })    

    })
  } else {
    res.status(401).send('unauthorized')
  }

})

    // Messages.find({}).populate('user', 'username').exec((err, messages) => {
    //   if (err) return res.status(500).send(err)
    //   console.log(messages)
    //   return res.json(messages)
    // })    
// })

  module.exports = router

// router.post('/messages', (req, res) => {
//   User.findOne({ username: req.body.username }, async (err, userExists) => {
//     if (err) return res.status(500).send({error: err})
//     if (userExists) return res.status(400).send({error: 'username already exists'})

//     const user = await User.signUp(req.body.username, req.body.password)
//     res.status(201).send(user.sanitize())
//   })
// })