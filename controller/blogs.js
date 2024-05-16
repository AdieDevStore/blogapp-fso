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

const decodeToken = async (token) => {
  const result = await jwt.verify(token, process.env.SECRET)
  return result
}

const fetchUser = async (userID) => {
  const userQuery = await knex('users').select().where({id: userID}).then(result => result[0])
  return userQuery
}

const postBlog = async (blogPost) => {
  const query = await knex('blogs').insert(blogPost)
  return query
}

// get one
blogRouter.get('/', (req, res) => {
  knex
  .select()
  .from('blogs')
  .then(blogs => {
    if (blogs.length === 0) {
      return Promise.reject('no data returned')
    }
    res.status(200).json(blogs)
  })
  .catch(error => {
    console.log(error)
    res.status(400).json({message: 'An error occurred'})
  })
})

// create one post
blogRouter.post('/', async (req, res) => {
  let {title, author, likes, url} = req.body

  if (!title || !author || !likes || !url) {
    res.status(400)
    .json({message: 'Data missing'})
    .end()
    return
  }

  const token = getTokenFrom(req)
  
  if (!token) {
    res.status(401).json({message: 'Please log in'})
    return
  }
  const decodedToken = await decodeToken(token)
  const user = await fetchUser(decodedToken.id) 
  const post = {
    title: title,
    author: author,
    likes: likes, 
    url: url, 
    owner_id: user.id
  }

  try {
    await postBlog(post)
    res.status(201).json(post)
  } catch (error) {
    console.log(error.message, error.stack)
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
    return res.status(201)
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

module.exports = blogRouter