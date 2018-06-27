const mongoose = require('mongoose')
const urlFile = require('../pwd.js')

const url = haeURL()

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person