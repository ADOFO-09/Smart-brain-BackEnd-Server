const express = require('express');
const app = express();

app.use(express.json()); // Body parsing middleware

const handleSignin = (req,res, bcrypt, db) => {
    const {email, password} = req.body;
    // User input validation
    if(!email ||  !password){
        return res.status(400).json("incorrect forms submission")
    }
    db.select('email','hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid){
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong crendentials'))
}

module.exports = {
    handleSignin: handleSignin
}