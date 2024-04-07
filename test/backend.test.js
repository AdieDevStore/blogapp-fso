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

test('blog likes set to zero if type not equal to number', async () => {
  const post = {
    author: 'Adrian Viljoen', 
    title: 'Importance of Testing Code', 
    url: '', 
  }

  const request = await api
  .post('/api/blogs')
  .send(post)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  assert.strictEqual(request.body.likes, 0)
})

test('blogs has missing information, return 400', async () => {
  const post = {}

  const request = await api
  .post('/api/blogs')
  .send(post)
  .expect(400)

  assert.strictEqual(request.statusCode, 400)
})

test('get one blog from list', async () => {
  const id = '5a422a851b54a676234d17f7'

  const singleBlog = await api
  .get(`/api/blogs/${id}`)
  
  assert.strictEqual(singleBlog.body.title, 'React patterns')
})

test('delete one blog entry from DB', async () => {
  const originalNotes = blogs.length
  const id = '5a422a851b54a676234d17f7'

  await api
  .delete(`/api/blogs/delete/${id}`)
  .expect(204)

  const notesAfterDelete = await api
  .get('/api/blogs')

  assert.strictEqual(notesAfterDelete.body.length, originalNotes - 1)
})

test('attempt to delete blog that does not exist', async () => {
  const fakeID = '5a422a851b54a676234d1300'

  const response = await api 
  .delete(`/api/blogs/delete/${fakeID}`)
  .expect(404)

  assert.strictEqual(response.statusCode, 404)
})

after(async () => {
  await mongoose.connection.close()
})