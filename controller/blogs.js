const blogRouter = require('express').Router()
const knex = require('../utils/knex')
const jwt = require('jsonwebtoken')

// to better handle errors Knex favours callbacks 

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}


// get one
blogRouter.get('/', (req, res) => {
  knex
  .select()
  .from('blogs')
  .then(blogs => {
    res.status(200).json(blogs)
  })
  .catch(error => {
    console.log(error)
    res.status(400).json({message: 'An error occurred'})
  })
  .finally(
    res.status(500)
  )
})

// create one post
blogRouter.post('/', async (req, res) => {
  // owner_id should never be null
  let {title, author, likes, url} = req.body

  const token = getTokenFrom(req)
  if (!token) {
    res.status(401).json({message: 'Please log in'})
    return
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const user = await knex('users').select().where({id: decodedToken.id}).then(result => result[0])
  
  if (!title || !author || !likes || !url) {
    res.status(400)
    .json({message: 'Data missing'})
    .end()
    return
  }

  try {
    knex('blogs')
    .insert({title: title, author: author, likes: likes, url: url, owner_id: user.id})
    .then(response => {
      res.status(201)
      .json({
        title: title, 
        author: author,
        likes: likes,
        url: url,
        owner_id: user.id
      })
    })
  } catch (error) {
    console.log(error)
    res.status(400).end()
  }
})

// get one row/post
blogRouter.get('/:id', (req, res) => {
  const id = req.params

  if(!id) {
    res.status(404)
    .json({message: 'data missing'})
    .end()
    return 
  }

  knex.select()
  .from('blogs')
  .where(id)
  .first()
  .then(row => {
    res.status(201)
    .json(row)
  })
  .catch(error => {
    console.log(error)
    res.status(404)
  }) 
})

// update one row/post
blogRouter.put('/:id', (req, res) => {
  const id = req.params.id
  const likes = req.body.likes

  if (!likes | !id ) {
    res.status(400)
    .json({message: 'information missing'})
    .end()
    return
  }

  knex('blogs')
  .where({id: id})
  .update({
    likes: likes
  })
  .then(result => {
    console.log(result)
    res.status(203)
    res.redirect('/api/blogs/')
  })

})

// delete one row/post
blogRouter.delete('/:id', (req, res) => {
  const id = req.params.id

  if (!id) {
    res.status(400).json({message: 'incomplete data'})
    return
  }

  knex('blogs')
    .where('id', id)
    .del()
    .then(result => {
    res.status(202).end()
  })
})

blogRouter.get('/testToken', (req, res) => {

})

// old mongoose code - will be updated to use knex

/*
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

// update one
blogRouter.patch('/:id', async (request, response) => {
  const id = request.params.id
  const updated = {
    likes: request.body.likes
  }
  const blogExists = await Blog.exists({_id: id})

  if (!blogExists) {
    response.status(404).end()
  }

  await Blog.findByIdAndUpdate(id, updated, {new: true})
  response.json(updated).status(200)
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
*/

module.exports = blogRouter