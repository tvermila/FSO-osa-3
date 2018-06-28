const mongoose = require('mongoose')
const urlFile = require('../pwd.js')

const url = haeURL()

mongoose.connect(url)

const personSchema = mongoose.Schema({ name: String, number: String, id: String })
const Person = mongoose.model('Person', personSchema)

personSchema.statics.format = function(p) {
    return  ({ 
      name: p.name,
      number: p.number,
      id: p._id
    })
  }

module.exports = Person