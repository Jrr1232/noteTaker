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
app.delete('/api/notes/:id', (req, res) => {
    const idToDelete = req.params.id;

    // Find the index of the note with the given ID in the array
    const indexToDelete = noteData.findIndex((note) => note.id === idToDelete);

    if (indexToDelete === -1) {
        // If the note with the provided ID is not found, send a 404 Not Found response
        res.status(404).json({ error: 'Note not found' });
    } else {
        // Remove the note from the array
        noteData.splice(indexToDelete, 1);

        // Write the updated note data to the JSON file
        const reviewString = JSON.stringify(noteData);
        fs.writeFile('./db/db.json', reviewString, (err) =>
            err
                ? console.error(err)
                : console.log('Note has been deleted and data updated in JSON file')
        );

        // Send a success response
        res.status(204).send();
    }
});



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
