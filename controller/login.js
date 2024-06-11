const loginRouter = require('express').Router()
const knex = require('../utils/knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

  // now only returns one user 
  const getUser = async (username) => {
    const result = await knex.select().from('users').where({username: username}).then(result => result[0])
    return result
  }
  
  const checkPassword = async (password, fetchedUserPasswrd) => {
    const result = await bcrypt.compare(password, fetchedUserPasswrd)
    return result
  }

  const createToken = (username, id) => {
    const token = {username: username, id: id}
    return jwt.sign(token, process.env.SECRET, {expiresIn: '1m'})
  }

loginRouter.post('/', async (req, res) => {
  const {username, password} = req.body

  if (!username || !password) {
    return res.status(400).json({message: 'no user/password information'})
  }
 
  const user = await getUser(username)

  if (!user) {
    return res.status(400).json({message: 'no user exists'})
  }

  try {
    const match = await checkPassword(password, user.password_hash)
    if (!match) {
      res.status(401).json({message: 'passowrd incorrect'})
    } else {
      const token = createToken(user.username, user.id)
      return res.status(201).json({token, username: user.username})
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'and error occured, check trace'})
  }
  
})

module.exports = loginRouter