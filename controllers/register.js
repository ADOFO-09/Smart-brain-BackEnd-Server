const express = require('express');
const app = express();

app.use(express.json()); // Body parsing middleware

const handleRegister = (req,res, bcrypt, db) => {
    const {email,name, password} = req.body;
    // User input validation
    if(!email || !name || !password){
        return res.status(400).json("incorrect forms submission")
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to register"));
}

module.exports = {
    handleRegister: handleRegister
}