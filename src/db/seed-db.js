const fs = require('fs')
const mongoose = require('mongoose')
const Chapter = require('../models/chapter.js')

mongoose.connect('mongodb://127.0.0.1:27017/moby-dick', {
  useNewUrlParser: true, 
  useCreateIndex: true
})

let fileString = fs.readFileSync('../../assets/mobydick.txt').toString()

let chapters = fileString.split('\nCHAPTER')
chapters.shift()

let chaptersParsed = []
chapters.forEach((chapter) => {
  let title;
  chapterLines = chapter.split('\n')
  chapterLines.forEach((line) => {
    if (line.trim().search(/^\d{1,3}\..+[.!?]/) !== -1) {
      title = line
    }
  })

  chapterObject = {
    title, 
    text: chapter
  }
  chaptersParsed.push(chapterObject)
})

chaptersParsed.forEach((chapter) => {
  let currentChapter = new Chapter({
    title: chapter.title,
    text: chapter.text
  })
  currentChapter.save().then(() => {
    console.log(currentChapter.title);
  }).catch((error) => {
    console.log(error)
  })
})

