const jwt = require('jsonwebtoken')

const decodeToken = async (token) => {
  await jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) {
      return error.name
    }
    return decoded
  })
  
}

module.exports = decodeToken