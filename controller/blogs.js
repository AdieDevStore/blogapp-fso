const blogRouter = require('express').Router()
const knex = require('../utils/knex')
const getTokenFrom = require('../utils/tokenExtractor').getTokenFrom
const decodeToken = require('../utils/tokenExtractor').decodeToken


const fetchUser = async (userID) => {
  const userQuery = await knex('users').select().where({id: userID}).then(result => result[0])
  return userQuery
}

const postBlog = async (blogPost) => {
  const query = await knex('blogs').insert(blogPost)
  return query
}

const fetchOneWithID = async (id) => {
  const result = await knex('blogs').select().where('id', id)
  return result
}

const fetchAllPosts = async (id) => {
  const result = await knex('blogs').select().where({owner_id: id})
  return result
}

blogRouter.get('/test_all', (req, res) => {
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
blogRouter.post('/create', async (req, res) => {
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

// only fetches by by ID
blogRouter.get('/fetch_one/:id', async (req, res) => {
  const id = req.params.id

  if(!id) {
    res.status(404)
    .json({message: 'data missing'})
    .end()
    return 
  }

  try {
    const result = await fetchOneWithID(id)
    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res.status(404).json({message: "An error occurred"})
  }
})

// update one row/post
blogRouter.put('/update/:id', (req, res) => {
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
    res.redirect('/api/blogs/test_all')
  })

})

blogRouter.get('/users_blogs', async (req, res) => {
  const token = getTokenFrom(req)

  if (!token) {
    res.status(401).json({message: 'you must be logged in to see all posts'})
  }

  const decodedToken = await decodeToken(token)
  try {
    const user = await fetchUser(decodedToken.id)
    if (!user) {
      throw new Error('No user found')
    }
    return user
  } catch (error) {
    console.log(error)
    res.status(404).json({message: 'No user found'})
  }

  try {
    console.log(await fetchAllPosts(user.id))
  } catch (error) {
    console.log(error)
  }

})

// delete one row/post
blogRouter.delete('/delete/:id/', (req, res) => {
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