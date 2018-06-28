const mongoose = require('mongoose')
const urlFile = require('../pwd.js')

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({ name: String, number: String, id: String })
const Person = mongoose.model('Person', personSchema)

personSchema.statics.format = function() {
  return this.model({ name: this.name, number: this.number, id: this._id })

  }

module.exports = Person