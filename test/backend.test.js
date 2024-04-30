const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const knex = require('../utils/knex')
const app = require('../app')
const blogs = require('./blogs')
const writeToDB = require('../utils/backend_test_helper')

const api = supertest(app)

// this test will only pass once - not resetting test db due to id's changing 
test('get all blogs', async () => {
   const response = await api.get('/api/blogs')
   assert.strictEqual(response.body.length, blogs.length)
 })

test('get one blog', async () => {
  const id = 96
  const response = await api.get(`/api/blogs/${id}`)
  assert.strictEqual(response.body.id, 96)
})

// only runs see comment on get all blogs
test('delete one blog', async () => {
  const id = 96
  const response = await api.delete(`/api/blogs/${id}`)
  assert.strictEqual(response.statusCode, 202)
})

test('update likes on one blog', async () => {
  const id = 101
  const newData = {likes: 20}
  const response = await api.put(`/api/blogs/${id}`).send(newData)
  assert.strictEqual(response.statusCode, 302)
})

after(() => {
  knex.destroy()
})