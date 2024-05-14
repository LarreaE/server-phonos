import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';
import * as db from './db/connection.js';

import mongoose from 'mongoose';

import Hypher from 'hyphen';
import euskaraPattern from 'hyphen/patterns/eu.js';

// Create a Hypher object with the Basque hyphenation pattern
const hyphenator = new Hypher(euskaraPattern);

const mongodbRoute = process.env.MONGO_ROUTE + "kaotikards";


async function start(){

    try{
       
        await mongoose.connect(mongodbRoute);
        app.listen( 0
            , () => {
            console.log(`Api is running on port ${0
            }`);
        })
        console.log(`Conexion con la base de datos Mongo Correcta`)


                }
                catch (error){
                    console.log(`Error al conectar con la base de datos: ${error.message}`);
                }
            }




start();




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

app.listen(port, () => {
    console.log(`phonos app listening on port ${port}`);
})
