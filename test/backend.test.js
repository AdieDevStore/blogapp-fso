const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const blogs = require('./blogs')
const writeToDB = require('../utils/backend_test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await writeToDB(blogs)
})

test('get all blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, blogs.length)
})

test('check if id property is string', async () => {
  const response = await api.get('/api/blogs')
  const ids = response.body.map(blog => blog.id)
  assert.strictEqual(ids[0], '5a422a851b54a676234d17f7')
})

test('check if post requests are handles correctly', async () => {
  const post = {
    author: 'Adrian Viljoen', 
    title: 'Importance of Testing Code', 
    url: '', 
    likes: 0
  }

  await api
  .post('/api/blogs')
  .send(post)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const notes = await api.get('/api/blogs')
  assert.strictEqual(notes.body.length, blogs.length + 1)
})

after(async () => {
  await mongoose.connection.close()
})