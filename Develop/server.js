const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const { v4: uuidv4 } = require('uuid')
const app = express()
const PORT = 3001;

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);


app.get('/api/notes', (req, res) =>
    res.json(noteData)
);

app.post('/api/notes', (req, res) => {
    const { title, test } = req.body;
    if (title && test) {
        const newNote = {
            title,
            test,
            review_id: uuidv4(),
        };
        const response = {
            status: 'success',
            body: newNote,
        }
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});





app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
