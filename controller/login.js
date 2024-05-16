const loginRouter = require('express').Router()
const knex = require('../utils/knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
  const {username, password} = req.body

  if (!username || !password) {
    return res.status(400).json({message: 'no user/password information'})
  }
  
  // does not return an array, just a single user
  const getUser = async (username) => {
    const result = await knex.select().from('users').where({username: username}).then(result => result[0])
    return result
  } 

  const user = await getUser(username)

  if (!user) {
    return res.status(404).json({message: 'no user found'})
  }

  const isSafe = await bcrypt.compare(password, user.password)
  const usersToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(usersToken, process.env.SECRET)

  if (!isSafe) {
    return res.status(401).json({message: 'passowrd incorrect'})
    
  } else {
      return res.status(201).send({token, username: user.username}).end()
  }
  
})

module.exports = loginRouter