require('dotenv').config()
const express = require('express')
// const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const blogRouter = require('./controller/blogs')
const userRouter = require('./controller/users')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)

module.exports = app



