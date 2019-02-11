const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@hy-fullstack-cluster-mt80j.mongodb.net/puhelinluettelo?retryWrites=true`

mongoose.connect(url, {useNewUrlParser: true})

const personSchema = new mongoose.Schema({name: String, number: String})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person)
            })
            mongoose
                .connection
                .close()
        })
} else {
    const person = new Person({name: process.argv[3], number: process.argv[4]})
    person
        .save()
        .then(response => {
            console.log('Lisätään', person.name, ",", person.number, "luetteloon.");
            mongoose
                .connection
                .close();
        })
}