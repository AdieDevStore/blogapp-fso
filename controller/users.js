const userRouter = require('express').Router()
const knex = require('../utils/knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

userRouter.post('/', async(req, res) => {
  const {username, password} = req.body
  const saltRounds = 10 

  if (!username || !password) {
    res.status(406).json({message: 'No username | password'})
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
        res.status(200).json(user)
      })
  } catch(error) {
    res.status(400).json({message: 'Bad Request, go away'})
  }
  
})

userRouter.post('/login', async (req, res) => {
  const {username, password} = req.body

  if (!username || !password) {
    res.status(400).json({message: 'no user/password information'})
    return
  }
  
  const user = await knex.select().from('users').where({username: username})

  if (user.length === 0) {
    res.status(404).json({message: 'no user found'})
    return
  }

  const isSafe = await bcrypt.compare(password, user[0].password_hash)
  const usersToken = {
    username: user[0].username,
    id: user[0].id
  }

  const token = jwt.sign(usersToken, process.env.SECRET)

  if (!isSafe) {
    res.status(401).json({message: 'passowrd incorrect'})
    
  } else {
      res.status(201).send({token, username: user[0].username}).end()
  }
  
})

module.exports = userRouter