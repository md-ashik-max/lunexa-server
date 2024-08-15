const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// vOFcZWwASRYkE1u5
// lunexa

// middleware

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('lunexa is running')
})
app.listen(port, () => {
    console.log(`lunexa is running port on :${port}`)
})