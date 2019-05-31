const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

const Chapter = require('./src/models/chapter.js')
require('./src/db/mongoose')

app.use(express.json())

app.get('/mobydick', (req, res) => {
  Chapter.find({}).sort('idNumerical').then((chapters) => {
    res.status(200).send(chapters)
  }).catch((error) => {
    res.status(404).send(error)
  })
})

app.post('/mobydick-search', (req, res) => {
  console.log(req.body)
  Chapter.find({}).sort('idNumerical.').then((chapters) => {
    let results = [];
    chapters.forEach( function(chapter) {
      if (chapter.text.toLowerCase().includes(req.body.post[0].toLowerCase()) 
          || chapter.title.toLowerCase().includes(req.body.post[0].toLowerCase())) {
        results.push(chapter.title.trim());
      }
    });
    console.log(results);
    res.send(results);
  }).catch((error) => {
    res.send(error)
  });
})

app.listen(port, () => console.log(`Listening on port ${port}`))
