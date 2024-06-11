require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const allPosts = require('./controller/allBlogs')
const blogRouter = require('./controller/blogs')
const userRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const tokenAuthenticator = require('./tokenAuthenticator')
const errorHandler = require('./middleware/error')

app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/allposts', allPosts)
app.use('/api/blogs', tokenAuthenticator ,blogRouter)
app.use(errorHandler)


module.exports = app



