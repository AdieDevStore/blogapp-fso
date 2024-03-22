require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controller/router.js')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)

app.use(cors())
app.use(express.json())
app.use('/api/blog', blogRouter)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})