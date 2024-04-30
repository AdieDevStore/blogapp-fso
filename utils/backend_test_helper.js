const knex = require('../utils/knex')

const writeToDB = async (blogs) => {
  for (let i = 0; i < blogs.length; i++) {
    await knex('blogs').insert({title: blogs[i].title, author: blogs[i].author, likes: blogs[i].likes, url: blogs[i].url})
  }
  console.log('operation completed')
}

module.exports = writeToDB