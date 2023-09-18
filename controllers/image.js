const Clarifai = require('clarifai');
const express = require('express');
const app = express();
const axios = require('axios');


app.use(express.json()); // Body parsing middleware


// const app = new Clarifai.App({
//     apiKey: 'dc8af10eb7e34f5da10ffa571c609e9f'
//   });


const handleApiCall = (req, res) => {
        //help me => user_id can be found in multiple ways, one way is in https://portal.clarifai.com/settings/profile 
        const USER_ID = "dev-id";

        
        // Your PAT (Personal Access Token) can be found in the portal under Authentification
        // help me => PAT can be found in https://portal.clarifai.com/settings/authentication (create one if necessary!)
        const PAT = "804b3b17ea1245de94df8c10382621b2"; 
        
        
        // help me => App Id is just the name of your app on the portal. 
        const APP_ID = "second-application"; 
    
    
        // Change these to whatever model and image input you want to use
        // help me => https://help.clarifai.com/hc/en-us/articles/1500007677141-Where-to-find-your-Model-IDs-and-Model-Version-IDs
        const MODEL_ID = "face-detection";
        const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
    
        const IMAGE_URL = req.body.input;
    
        ///////////////////////////////////////////////////////////////////////////////////
        // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
        ///////////////////////////////////////////////////////////////////////////////////
        const raw = JSON.stringify({
            user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
            },
            inputs: [
            {
                data: {
                image: {
                    url: IMAGE_URL,
                },
                },
            },
            ],
        });
    
        const requestOptions = {
            method: "POST",
            headers: {
            Accept: "application/json",
            Authorization: "Key " + PAT,
            },
            body: raw,
        };
    
        axios
            .get(
                "https://api.clarifai.com/v2/models/" +
                MODEL_ID +
                "/versions/" +
                MODEL_VERSION_ID +
                "/outputs",
                requestOptions
            )
            .then(data => {
                res.json(data)
            })
            .catch(err => res.status(400).json("unable to call API"))
    }
    

const handleImage = (req, res, db) => {
    const {id} = req.body;
    db('users').where('id','=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
                res.json(entries[0]);
        })
        .catch(err => res.status(400).json("unable to get count"));
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}