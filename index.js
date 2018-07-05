const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())

app.use(express.static('build'))

morgan.token('data', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())

app.get('/api', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
      console.log('HENKILÖT SAATU:',persons.map(Person.format))
    })
    .catch(error => {
      console.log('error:',error)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(Person.format(person))
    })
    .catch(error => {
      console.log('error:',error)
    })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      const maara = persons.length
      const pvm = new Date()
      console.log('määrä:', maara)
      let response = `
                <p>Puhelinluettelossa on ${maara} henkilön tiedot</p>
                <p>${pvm}</p>
                `
      console.log(response)
      res.send(response)
    })
    .catch(error => {
      console.log('error:',error)
    })
})

app.delete('/api/persons/:id', (req, res) => {
  console.log('api.delete() poistettava id:', req.params.id)
  Person
    .findByIdAndRemove(req.params.id)
    .then(person => {
      console.log('poistettu henkilö:\n', Person.format(person))
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
    })
})

app.post('/api/persons', (req, res) => {
  const nimi = req.body.name
  const numero = req.body.number
  const newPerson = new Person({
    name: nimi,
    number: numero
  })
  Person
    .find({ name: nimi })
    .then(result => {
      if(result.length > 0){
        console.log('VIRHE: kannasta löytyi jo henkilö samalla nimellä!')
        res.status(409).send({ error: `confict - ${newPerson.name} is already in the database` })
      }else {
        newPerson
          .save()
          .then(savedPerson => {
            console.log('tallennettu uusi henkilö:', savedPerson)
            res.json(Person.format(savedPerson))
          })
          .catch(error => {
            console.log('error:', error)
          })
      }
    })
    .catch(error => {
      console.log('error:', error)
    })
})

app.put('/api/persons/:id', (req, res) => {
  const person = req.body
  const id = req.params.id
  Person
    .findByIdAndUpdate(id, person, { new: true } )
    .then(updatedPerson => {
      console.log('Päivitetty henkilö:', updatedPerson)
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log('error:', error)
    })
})

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})