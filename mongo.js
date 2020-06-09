const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0-d6osv.mongodb.net/phone-book-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const addPerson = (name, number) => {
  const person = new Person({
    name: name, number: number
  })
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook: ${result.toJSON()}`)
    mongoose.connection.close()
  })
}

const listPersons = () => {
  Person.find({})
    .then(persons => {
      console.log('phonebook:')
      persons.forEach(person => console.log(`${person.name} ${person.number}`))
      mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
  addPerson(process.argv[3], process.argv[4])
} else if(process.argv.length === 3) {
  listPersons()
} else {
  console.log('wrong number of parameters')
  mongoose.connection.close()
}