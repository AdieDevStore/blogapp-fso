const userRouter = require('express').Router()
const knex = require('../utils/knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

userRouter.post('/', async(req, res) => {
  const {username, password} = req.body
  const saltRounds = 10 

  if (!username || !password) {
    return res.status(406).json({message: 'No username | password'})

  }

  if (username.length <= 3 || password.length <= 3) {
    return res.status(406).json({message: 'minimum length requirements not met for username or password'})
  }
  
  const passwordHash = await bcrypt.hash(password, saltRounds)
  
  const user = {
    username: username,
    password_hash: passwordHash
  }

  try {
    knex('users')
      .insert(user)
      .then(response => {
        return res.status(200).json({message: 'user created, redirect'})
      })
  } catch(error) {
      return res.status(400).json({message: 'Bad Request, go away'})
  }
  
})

// move to a separate file
userRouter.post('/login', async (req, res) => {
  const {username, password} = req.body

  if (!username || !password) {
    return res.status(400).json({message: 'no user/password information'})
  }
  
  const user = await knex.select().from('users').where({username: username})

  if (user.length === 0) {
    return res.status(404).json({message: 'no user found'})
  }

  const isSafe = await bcrypt.compare(password, user[0].password_hash)
  const usersToken = {
    username: user[0].username,
    id: user[0].id
  }

  const token = jwt.sign(usersToken, process.env.SECRET)

  if (!isSafe) {
    return res.status(401).json({message: 'passowrd incorrect'})
    
  } else {
      return res.status(201).send({token, username: user[0].username}).end()
  }
  
})

module.exports = userRouter