const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())

app.use(express.static('build'))

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())

  const info = () => {
    const maara = persons.length
    const pvm = new Date()
    console.log('määrä:', maara)
    response = `
                <p>Puhelinluettelossa on ${maara} henkilön tiedot</p>
                <p>${pvm}</p>
                `
    return response
  }

  const generateId = () => {
    return Math.floor(Math.random() * 10000)
  }

  const formatPerson = (person) => {
    return {
      name: person.name,
      number: person.number,
      id: person._id
    }
  }

app.get('/api', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
    .catch(error => {
      console.log('error:',error)
    })  
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(formatPerson(person))
    })
    .catch(error => {
      console.log('error:',error)
    })      
})

app.get('/info', (req, res) => {
    res.send(info())
})

app.delete('/api/persons/:id', (req, res) => {
  console.log("api.delete() poistettava id:", req.params.id)
  Person    
    .findByIdAndRemove(req.params.id)
    .then(person => {
      console.log('poistettu henkilö:\n', formatPerson(person))
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
    })
})

app.post('/api/persons', (req, res) => {    
    const body = req.body
/*    const p = persons.filter(p => p.name === body.name)
    if(body.name === undefined || body.number === undefined) {
      return res.status(400).json({ error: 'content missing!' })
    }else if(p.length > 0) {
      return res.status(400).json({ error: "name must be unique!" })
    }*/
    const newPerson = new Person({
      name: body.name,
      number: body.number
    })    
    newPerson
      .save()
      .then(savedPerson => {
        console.log('tallennettu uusi henkilö:', savedPerson)
        res.json(formatPerson(savedPerson))
      })
      .catch(error => {
        console.log('error:', error)
      })  
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})