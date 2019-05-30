const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

const Chapter = require('./src/models/chapter.js')
require('./src/db/mongoose')

app.use(express.json())

app.get('/', (req, res) => {  
  res.send({ express: 'Hello from backend' })
})

app.get('/mobydick', (req, res) => {
  Chapter.find({}).sort('idNumerical').then((chapters) => {
    res.status(200).send(chapters)
  }).catch((error) => {
    res.status(404).send(error)
  })
})

app.post('/', (req, res) => {  
  console.log(req.body)
  res.send(`I received your POST request. This is what you sent me: ${req.body.post}`)
})

app.listen(port, () => console.log(`Listening on port ${port}`))