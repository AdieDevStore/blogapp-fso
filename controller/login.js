const loginRouter = require('express').Router()
const knex = require('../utils/knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
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

module.exports = loginRouter