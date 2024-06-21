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

const checkUserValid = async (postId, userID) => {
  const post = await knex('blogs').where('id', postId).update(body)
  if (userID != post.owner_id) {
    return false
  } else return true
}


blogRouter.post('/create', async (req, res, next) => {
  let {title, author, likes, url} = req.body

  const user = await fetchUser(req.id)
  const post = {
    title: title,
    author: author,
    likes: likes, 
    url: url, 
    owner_id: user.id
  }

  // if fails validation, 400 error
  if (!title || !author || !likes || !url) {
    const error = new Error("Outstanding data")
    return next(error)
  }

  // this would only really fail if the DB is down/changed/doesnt exist
  // if it fails, use error code 500...something is seriosly wrong
  try {
    await postBlog(post)
    res.status(201).json(post)
  } catch (error) {
    return next(error)
  }
})

// only fetches by by ID - should this route be public? 
blogRouter.get('/fetch_one/:id', async (req, res, next) => {
  const id = req.params.id

  try {
    const result = await fetchOneWithID(id)
    if (result.length === 0) {
      throw Error('No content')
    }
    res.status(200).json(result)
  } catch (error) {
    return next(error)
  }
})

// update one row/post
blogRouter.put('/update/:id', async (req, res, next) => {
  const {username, id} = req
  const postId = req.params.id

  if (!username || id) {
    const error = new Error('No user logged in')
    return next(error)
  }

  if (!req.body ) {
    const error = new Error('No data received')
    return next(error)
  }

  try {
    const userIsAllowed = checkUserValid(postId, id)
    if (!userIsAllowed) {
      throw new Error('This post does not belong to the user')
    }

    await updatePost(postId, req.body)
    res.status(202).end()
  } catch (error) {
    return next(error)
  }

})

blogRouter.get('/users_blogs', async (req, res, next) => {
  const {username, id} = req
  
  try {
    const user = await fetchUser(id)
    const posts = await fetchAllPosts(user.id)
    res.status(200).json(posts)
  } catch (error) {
    next(error)
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