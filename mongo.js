const mongoose = require('mongoose')
const urlFile = require('./pwd.js')


// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = haeURL()

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const person = new Person({
  name: 'Testi Apina',
  number: "050 - 444 6789"
})

person
  .save()
  .then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })