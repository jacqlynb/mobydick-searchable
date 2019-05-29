const mongoose = require('mongoose')

const Chapter = mongoose.model('Chapter', {
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})

module.exports = Chapter