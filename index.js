const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person.id
  }
}

app.use(cors())

app.use(express.static('build'))

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())


let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
  ]

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

app.get('/api', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })  
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(person) {
        res.json(person)
    }else {
        res.status(404).end()
    }
    
})

app.get('/info', (req, res) => {
    res.send(info())
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {    
    const body = req.body
    const p = persons.filter(p => p.name === body.name)
    if(body.name === undefined || body.number === undefined) {
      return res.status(400).json({ error: 'content missing!' })
    }else if(p.length > 0) {
      return res.status(400).json({ error: "name must be unique!" })
    }
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId()
    }    
    persons = persons.concat(newPerson)
    res.json(newPerson)
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})