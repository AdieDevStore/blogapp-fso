const allPosts = require('express').Router()
const knex = require('../utils/knex')

allPosts.get('/', (req, res) => {
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

module.exports = allPosts