const userRouter = require('express').Router()
const knex = require('../utils/knex')
const bcrypt = require('bcrypt')


userRouter.post('/', async(req, res) => {
  const {username, password} = req.body
  const saltRounds = 10 

  if (!username || !password) {
    return res.status(406).json({message: 'No username | password'})
  }

  if (username.length <= 3 || password.length <= 3) {
    return res.status(406).json({message: 'minimum length requirements not met for username or password'})
  }

  // check if user exists 
  const userExists = await knex('users').select().where({username: username})
  
  if (userExists.length != 0) {
    return res.status(409).json({message: 'user already exists'})
  }

  const passwordHash = await bcrypt.hash(password, saltRounds)
  
  const user = {
    username: username,
    password_hash: passwordHash
  }

  const writeUserToDB = async (user) => {
    return knex('users').insert(user)
  }

  try {
    const result = await writeUserToDB(user)
    if (result.error) {
      throw new DatabaseError('Unable to write to database, ', result.error)
    }
    res.status(201).json({messsage: 'user created'})
  } catch (DatabaseError) {
    console.log(DatabaseError)
  }
  
})

module.exports = userRouter