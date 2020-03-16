const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit'); 


const app = express();

const db = monk('mongodb+srv://admin:admin@yell-b8kds.mongodb.net/test?retryWrites=true&w=majority');
const yells = db.get('yells');
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Yeller'
    });
});

app.get('/yells', (req, res) =>  {
    yells 
        .find()
        .then(yells => {
            res.json(yells);
        });
});

function isValidYell(yell) {
    return yell.name && yell.name.toString().trim() !== '' &&
    yell.content && yell.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMs: 30 * 1000,
    max: 1
  }));

app.post('/yells', (req, res) => {
    if (isValidYell(req.body)) {

    const yell = {
        name: filter.clean(req.body.name.toString()),
        content: filter.clean(req.body.content.toString()),
        created: new Date()
    };

    console.log(yell)

    yells 
        .insert(yell)
        .then(createdYell => {
            res.json(createdYell);
        });
    
    } else {
        res.status(422);
        res.json({
            message: 'Hey! Name and Content are required'
        });
    }
});

app.listen(5000, () => {
    console.log('Listing on http://localhost:5000');
});