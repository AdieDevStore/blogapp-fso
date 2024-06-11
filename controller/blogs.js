const blogRouter = require('express').Router()
const knex = require('../utils/knex')
const decodeToken = require('../utils/tokenDecoder')
const tokenExtractor = require('../utils/tokenExtractor')


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

const deletePost = async (id) => {
  const result = await knex('blogs').where('id', id).del()
  return result
}

// returns nothing seemingly -- thanks knex
const updatePost = async (id, body) => {
  const result = await knex('blogs').where('id', id).update(body)
  return result
}


blogRouter.post('/create', async (req, res) => {
  let {title, author, likes, url} = req.body

  const user = await fetchUser(req.id)
  const post = {
    title: title,
    author: author,
    likes: likes, 
    url: url, 
    owner_id: user.id
  }

  if (!title || !author || !likes || !url) {
    res.status(400)
    .json({message: 'Data missing'})
    .end()
    return
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
blogRouter.put('/update/:id', async (req, res) => {
  const token = getTokenFrom(req)
  const id = req.params.id

  if (!token) {
    res.status(401).json({message: 'User not authorised'})
    return
  }

  if (!req.body ) {
    res.status(400)
    .json({message: 'no data received'})
    return
  }

  try {
    await updatePost(id, req.body)
    res.status(202).end()
  } catch (error) {
    console.log(error)
    res.status(204).json({message: 'No content'})
  }

})

blogRouter.get('/users_blogs', async (req, res) => {
  const token = getTokenFrom(req)

  if (!token) {
    res.status(401).json({message: 'User not authorised'})
    return
  }

  const decodedToken = await decodeToken(token)
  
  try {
    const user = await fetchUser(decodedToken.id)
    const posts = await fetchAllPosts(user.id)
    res.status(200).json(posts)
  } catch (error) {
    console.log(error)
    res.status(404).json({message: 'No user found'})
  }

})

// delete one row/post
blogRouter.delete('/delete/:id', async (req, res) => {
  const id = req.params.id
  const token = getTokenFrom

  if (!token) {
    res.send(400).json({message: "You are not the post owner"})
    return 
  }

  if (!id) {
    res.status(400).json({message: 'incomplete data'})
    return
  }

  try {
    const deleteResult = await deletePost(id)
    if (deleteResult != 1) {
      throw new Error('No post exists')
    }
    res.status(204).end()
  } catch (error) {
    console.log(error)
  }
})

module.exports = blogRouter