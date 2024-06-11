const jwt = require('jsonwebtoken')
const tokenExtractor = require('./utils/tokenExtractor')
const tokenDecoder = require('./utils/tokenDecoder')
const decodeToken = require('./utils/tokenDecoder')

const verifyToken = async (req, res, next) => {

  const token = tokenExtractor(req)
    
  if (!token) {
      throw new Error('NoTokenProvided')
    }
  
  try {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        throw error
      } else {
        req.username = decoded.username
        req.id = decoded.id
      }
    })
    next()
  } catch(error) {
      next(error)
    }
  }

module.exports = verifyToken