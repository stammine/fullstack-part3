require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    }).catch(msg => next(msg))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(
    person => res.json(person)
  ).catch(msg => next(msg))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  console.log(id)
  Person.findByIdAndRemove(req.params.id).then(
    result => res.json(result.toJSON())
  ).catch(msg => next(msg))
})

app.post('/api/persons', (req, res, next) => {
  console.log(req.body)
  const person = new Person({
    name: req.body.name, number: req.body.number
  })
  person.save()
    .then(
      result => res.json(result.toJSON())
    ).catch(error => next(error))
})

const infoHtml = (count, time) => {
  return `
    <div>
        <p>Phonebook has info for ${count} people</p>
        <p>${time}</p>
    </div>
`
}

app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    const count = persons.length
    const time = new Date()
    res.send(infoHtml(count, time.toString()))
  }).catch(msg => next(msg))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})