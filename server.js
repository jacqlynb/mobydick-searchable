const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

const Chapter = require('./src/models/chapter.js')
require('./src/db/mongoose')

app.use(express.json())
// for production 
// if (process.env.NODE_ENV === 'production') {    
//   app.use(express.static(path.join(__dirname, 'client/build')));
// }
// app.get('*', (req, res) => {    
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));  
// });
// end for production

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

// production stuff
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


app.listen(port, () => console.log(`Listening on port ${port}`))

// heroku start
//"heroku-postbuild": "cd client && npm install && npm install --only=dev --no-shrinkwrap && npm run build",

// dev start
// "client": "cd client && yarn start",
//     "server": "nodemon server.js",
//     "dev": "concurrently --kill-others-on-fail \"yarn server\" \"yarn client\""