const express = require('express');
const app = express();

app.use(express.json()); // Body parsing middleware

const handleProfileGet = (req,res, db) => {
    const {id} = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
        if(user.length){
            res.json(user[0])
        } else {
            res.status(400).json("Not found")
        }
        
    })
    .catch(err => res.status(400).json("error getting user"))
    
}

module.exports = {
    handleProfileGet: handleProfileGet
}