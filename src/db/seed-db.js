const fs = require('fs')
const mongoose = require('mongoose')
const Chapter = require('../models/chapter.js')

mongoose.connect('mongodb://127.0.0.1:27017/moby-dick', {
  useNewUrlParser: true, 
  useCreateIndex: true
})

let fileString = fs.readFileSync('../../client/src/assets/mobydick.txt').toString()

let chapters = fileString.split('\nCHAPTER')
chapters.shift()

let idNumerical = 0;
let chaptersParsed = [];
chapters.forEach((chapter) => {
  let title;
  let text = [];
  chapterLines = chapter.split('\n')
  chapterLines.forEach((line) => {
    if (line.trim().search(/^\d{1,3}\..+[.!?]/) !== -1) {
      title = line
    } else {
      text = text.concat(line);
    }
  })

  text = text.join(' ')
  chapterObject = {
    title, 
    text,
    idNumerical: 1 + idNumerical
  }
  chaptersParsed.push(chapterObject);
  idNumerical += 1;
})

console.log(chaptersParsed)

// const savedChapters = chaptersParsed.map(({title, text}) => {
//   const currentChapter = new Chapter({title, text, idNumerical});
//   return currentChapter.save();
// });

// look up generator 

// Promise.all(savedChapters).then(() => {
//   console.log("Saved all chapters.");
// }).catch((error) => {
//   console.log('Something went wrong', error);
// });

chaptersParsed.forEach((chapter) => {
  let currentChapter = new Chapter({
    title: chapter.title,
    text: chapter.text,
    idNumerical: chapter.idNumerical
  })
  currentChapter.save().then(() => {
    console.log(currentChapter.title);
  }).catch((error) => {
    console.log(error)
  })
})
