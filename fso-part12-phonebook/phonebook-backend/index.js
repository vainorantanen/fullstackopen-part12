require('dotenv').config()

const express = require('express')
const logger = require('morgan');
const cors = require('cors');
const app = express()

const { Person } = require('./mongo')
const { response } = require('express')
const redis = require('./redis')

app.use(cors());
app.use(logger('dev'));
app.use(express.json())

/* GET statistics data. */
app.get('/statistics', async (req, res) => {
  try {
    const addedPersonsCount = await redis.getAsync('added_persons');
    const statistics = {
      added_persons: parseInt(addedPersonsCount) || 0,
    };
    res.send(statistics);
  } catch (error) {
    console.error('Error retrieving statistics:', error);
    return res.status(500).send({ error: 'Error retrieving statistics' });
  }
});

app.get('/api/persons', async (_, response) => {
  const persons = await Person.find({})
  response.send(persons)
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people <br></br>${Date()}</p>`)
  })

})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
  //console.log(req.params)
  //const id = Number(req.params.id)
  Person.findByIdAndRemove(req.params.id).then(result => {
    console.log(result)
    res.status(204).end()
  })
    .catch(error => next(error))

})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body
  console.log("reqbod", body)
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  console.log("personi backendis: ", person)

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))

  await redis.incrementPersonCounterAsync();
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})