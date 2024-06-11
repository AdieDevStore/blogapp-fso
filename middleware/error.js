const errorHandler = (error, req, res, next) => {
  if (error.name === 'TokenExpiredError') {
    return res.status(401).send({message: "Token expired"})
  }
}

module.exports = errorHandler