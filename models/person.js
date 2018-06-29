const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : process.env.MONGODB_URI_DEV

mongoose.connect(url)

const personSchema = new mongoose.Schema({ name: String, number: String, id: String })
const Person = mongoose.model('Person', personSchema)

personSchema.statics.format = function() {
  return this.model({ name: this.name, number: this.number, id: this._id })

}

module.exports = Person