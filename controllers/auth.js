const User = require('../models/User')
const express = require('express')
const jwt = require('jsonwebtoken')

const router = express.Router()


router.post('/signup', (req, res) => {
  User.findOne({ username: req.body.username }, async (err, userExists) => {
    if (err) return res.status(500).send({error: err})
    if (userExists) return res.status(400).send({error: 'username already exists'})

    const user = await User.signUp(req.body.username, req.body.password)
    res.status(201).send(user.sanitize())
  })
})

router.post('/login', (req, res) => {
  console.log(req.body)
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (err) return res.status(500).send(err)
    if (!user) return res.status(400).send({error: 'username invalid'})

    const matchingPassword = await user.comparePassword(req.body.password)

    if (!user || !matchingPassword) return res.status(400).send({"error": "Username or password is not one registered with the Signup form - use something that has been submitted previously"}) //cannot parse this as JSON on the front-end

    const token = jwt.sign({
      _id: user._id
    }, 'CHANGEME!')

    res.send({
      username: req.body.username,
      token })
  })
})

module.exports = router
