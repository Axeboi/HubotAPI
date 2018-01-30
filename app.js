const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const MatchQuery = require("./matchQuery.js")

const app = express()

mongoose.connect('mongodb://localhost/hubotapi', { useMongoClient: true} )

const linkSchema = mongoose.Schema({
    link: String,
    comment: String
})

const Link = mongoose.model('Link', linkSchema)

app.use(bodyParser.urlencoded({extended: false}))


// ROUTES

// READ all entries from database

app.get("/", (req, res) => {
    Link.find(function (err, link) {
        if (err) {
            console.log('Something went wrong with database connection: ' + err)
        } else {
            res.json(link)
        }
    })  
})


// READ entries matching query

app.get('/:word', function (req, res) {
    const query = req.params.word
    Link.find(function (err, found) {
        if (err) { 
            console.log(err) 
        } else {
            let output = MatchQuery.sorted(query, found, "comment")
            res.json(output)
        }
    })
})


// CREATE new entry

app.post('/', (req, res) => {
    Link.create(req.body, (err, result) => {
        if(err) { 
            console.log(err)
        } else { 
            res.send( {
                message: "Write to database successful",
                result: result
            })
        }

    })
})


// DELETE entry by id

app.delete('/:id', (req, res) => {
    Link.findByIdAndRemove({ id: req.body.id}, (err, result) => { 
        if(err) {
            console.log(err)
        } else { 
            res.send(result)
        }
    })
})


// RUN SERVER

app.listen(4000, () => {
    
    console.log("Server is running. Wating for action...")
})