require('dotenv').config()
const express = require('express')
// const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const blogRouter = require('./controller/router')

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app



