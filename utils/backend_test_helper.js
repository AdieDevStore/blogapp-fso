const Blog = require('../models/blog')
const mongoose = require('mongoose')

const writeToDB = async (blogs) => {
  for (let i = 0; i < blogs.length; i++) {
    let newBlog = new Blog(blogs[i])
    await newBlog.save()
  }
  console.log('operation completed')
}

module.exports = writeToDB