const express = require('express');
const fs = require('fs')
const path = require('path');
let noteData = require('./db/db.json');
const { v4: uuidv4 } = require('uuid')
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        noteData.push(newNote);
        const reviewString = JSON.stringify(noteData);
        fs.writeFile(`./db/db.json`, reviewString, (err) =>
            err
                ? console.error(err)
                : console.log(
                    `Review for has been written to JSON file`
                )
        );
        // const response = {
        //     body: noteData,
        // }
        // console.log(response);
        res.status(201).json(noteData);
    } else {
        res.status(500).json('Error in posting review');
    }
});





app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
