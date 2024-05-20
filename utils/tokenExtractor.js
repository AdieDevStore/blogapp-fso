const jwt = require('jsonwebtoken')

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const decodeToken = async (token) => {
  const result = await jwt.verify(token, process.env.SECRET)
  return result
}

module.exports = {getTokenFrom, decodeToken}
