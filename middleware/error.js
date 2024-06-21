const errorHandler = (error, req, res, next) => {
  if (error.name === 'TokenExpiredError') {
    return res.status(401).send({message: "Token expired"})
  } else if (error.status === 404) {
    return res.status(404).send({message: 'Page not found'})
  } else if (error.message === 'No content') {
    return res.status(204).send({message: 'no content returned'})
  } else {
    res.status(500).send({message: 'Server error'})
  }
  next()
}

module.exports = errorHandler