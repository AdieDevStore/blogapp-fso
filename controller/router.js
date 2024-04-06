const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  if ( !request.body.title || !request.body.author ) {
    response.status(400).end()
    return
  }

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = blogRouter