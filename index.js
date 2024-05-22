import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import * as db from './db/connection.js';

import Hypher from 'hyphen';
import euskaraPattern from 'hyphen/patterns/eu.js';

// Create a Hypher object with the Basque hyphenation pattern
const hyphenator = new Hypher(euskaraPattern);

let frase = "kaixo mundua, zer moduz zaude. Oso ongi eskerrikasko";

let res = await hyphenator(frase, {
    hyphenChar: "-"
})

console.log(res);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON
app.use(bodyParser.urlencoded({ extended: false })); // Middleware para parsear el cuerpo de las solicitudes URL-encoded

// Middleware para permitir solicitudes CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


app.get('/',(req,res) => {
    res.send('Hello phonos!')
})

app.get('/getFrases', async (req,res) => {

    const query = 'SELECT * FROM public.frases;'
    const result = await db.query(query)
    res.send(result.rows)
})

app.get('/getWords', async (req,res) => {

    const query = 'SELECT * FROM public.palabras;'
    const result = await db.query(query)
    res.send(result.rows)
})

app.get('/getSilabas', async (req,res) => {

    const query = 'SELECT * FROM public.silabas;'
    const result = await db.query(query)
    res.send(result.rows)
})

app.get('/getTextos', async (req,res) => {

    const query = 'SELECT * FROM public.textos;'
    const result = await db.query(query)
    res.send(result.rows)
})

app.listen(port, () => {
    console.log(`phonos app listening on port ${port}`);
})
