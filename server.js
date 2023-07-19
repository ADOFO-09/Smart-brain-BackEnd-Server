const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('this is working');
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