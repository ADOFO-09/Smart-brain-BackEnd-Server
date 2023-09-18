const express = require('express');
const bodyParser = require ("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const axios = require("axios");

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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


app.get('/', (req, res) => {
    res.send('success');
})
// Making signin post request to database
app.post('/signin', (req, res) => {signin.handleSignin(req, res, bcrypt, db)})
// Making register post request to database
app.post('/register', (req,res) => {register.handleRegister(req, res, bcrypt, db)})
// Making a get request using user id
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
// Making a put request for number of entries
app.put('/image',(req, res) => {image.handleImage(req, res, db)})
// Making a post request for api calls
app.post('/imageurl',(req, res) => {image.handleApiCall(req, res)})

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