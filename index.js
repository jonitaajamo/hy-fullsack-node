const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    }, {
        "id": 2,
        "name": "Martti Tienari",
        "number": "040-123456"
    }, {
        "id": 3,
        "name": "Arto Järvinen",
        "number": "040-123456"
    }, {
        "id": 4,
        "name": "Lea Kutvonen",
        "number": "040-123456"
    }
]

app.use(bodyParser.json())
app.use(cors())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
        JSON.stringify(req.body)
    ].join(' ')
}))

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const personCount = persons.length
    const dateTime = new Date()
    res.send(`<p>Puhelinluettelossa on ${personCount} henkilön tiedot</p><p>${dateTime}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res
            .status(404)
            .end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res
        .status(204)
        .end();
});

const generateId = () => {
    min = Math.ceil(1);
    max = Math.floor(1000000);
    return Math.floor(Math.random() * (max - min)) + min;
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res
            .status(400)
            .json({error: 'name missing'})
    } else if (body.number === undefined) {
        return res
            .status(400)
            .json({error: 'number missing'})
    } else if (persons.some(person => {
        person.name.toLowerCase === body.name.toLowerCase
    })) {
        return res
            .status(400)
            .json({error: 'name already listed'})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number || false
    }

    persons = persons.concat(person)

    res.json(person)
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${PORT}`)
})