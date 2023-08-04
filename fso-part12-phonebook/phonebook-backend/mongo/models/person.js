const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
  }
})

module.exports = mongoose.model('Person', personSchema)