const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// find all
blogRouter.get('/', async (request, response, next) => {
  const findAll = await Blog.find({})
  response.json(findAll).status(200)
})

// post onen
blogRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body)

  if (blog.likes != Number) {
    blog.likes = 0
  }

  if ( !request.body.title || !request.body.author ) {
    response.status(400).end()
    return
  }

  await blog.save()
  response.status(201).json(blog)
})

// find one
blogRouter.get('/:id', async(request, response) => {
  const id = request.params.id
  const checkIfExists = await Blog.exists({_id: id})

  if (!checkIfExists) {
    response.status(404).end()
  }

  const findOne = await Blog.findById(id)
  response.json(findOne).status(200)
})

// delete one
blogRouter.delete('/delete/:id', async (request, response) => {
  const id = request.params.id
  const checkIfExists = await Blog.exists(({_id: id}))

   if (!checkIfExists) {
    response.status(404).end()
  }

  await Blog.deleteOne( {_id: id} )
  response.status(204).end()
})

module.exports = blogRouter