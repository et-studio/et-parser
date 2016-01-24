'use strict'

const express = require('express')
const app = express()
const port = 8002

app.use('/node_modules', express.static('node_modules'))
app.use('/src', express.static('src'))
app.use(express.static('test'))

app.listen(port, function () {
  console.log('Running at ' + 'http://localhost:' + port)
})
