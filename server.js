const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smart-brain'
  }
});




const app = express();
// Middleware 
app.use(bodyParser.json());
app.use(cors());
const database = {
    users : [
    {
        id: '123',
        name: 'John',
        email: 'john@gmail.com',
        password: 'cookies',
        entries: 0,
        joined: new Date()
    },
    {
        id: '124',
        name: 'Sally',
        email: 'Sally@gmail.com',
        password: 'apples',
        entries: 0,
        joined: new Date()
    }
],
login: [
    {
        id: '987',
        hash: '',
        email: 'john@example.com'
    }
]
}


app.get('/', (req, res) => {
    res.send(database.users);
})
// Making signin post request to database
app.post('/signin', (req, res) => {
    // bcrypt.compare("apples","$2a$10$tAYTqahib4MT6psiBt1DuO2KfagfQ9fmuDzbSZn1vtiNFKOkCSjTq", function(err,res){
    //     console.log("first guess", res)
    // });
    // bcrypt.compare("vergies","$2a$10$tAYTqahib4MT6psiBt1DuO2KfagfQ9fmuDzbSZn1vtiNFKOkCSjTq", function(err,res){
    //     console.log("second guess", res)
    // });
    
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0])
    } else {
        res.status(400).json('error logging in')
    }
})

// Making register post request to database
app.post('/register', (req, res) => {
    const {name, email, password} = req.body;
    // bcrypt.hash(password,null,null, function(err,hash){
    //     console.log(hash)
    // });
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(users => {
        res.json(users[0])
    })
    .catch(err => res.status(400).json("unable to resgister"))
})

// Making a get request using user id
app.get('/profile/:id', (req, res)=> {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(404).json('not found');
    }
})

// Making a put request for number of entries
app.put('/image',(req, res) => {
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(404).json('not found');
    }
})

app.listen(3000, () => {
    console.log('app is running on port 3000');
})



/*
--> res = this is working
/signin --> Post = Process / fail
/register --> Post = user
/profile/userId --> GET = user
/image --> Put = user
*/