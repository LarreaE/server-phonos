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

app.get('/getSilFrases', async (req,res) => {

    const query = 'SELECT * FROM public.frases_s;'
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

app.get('/getUsers', async (req,res) => {

    const query = 'SELECT * FROM public.users;'
    const result = await db.query(query)
    res.send(result.rows)
})

app.post('/login', async (req,res) => {

    const userData = req.body;
    // Obtener la contraseña del GET
    try {
        const query = 'SELECT * FROM public.users;'
        const users = await db.query(query)
        
        
        for (let i = 0; i < users.rows.length; i++) 
            {
            const user = users.rows[i];
            if (user.username === userData.username && user.password === userData.password) {
                
                break;
            }
        }

        res.status(401).send('INCORRECT PASSWORD OR USER NOT FOUND');
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});
app.post('/register', async function(req, res) {
    const userData = req.body;

    try {
        // Obtener la lista de usuarios existentes
        const response = await axios.get("https://cardgame-er5-server.onrender.com/getUsers");
        const users = response.data;

        let emailExists = false;

        // Verificar si el correo electrónico ya está en uso
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === userData.email) {
                emailExists = true;
                //break;
            }
        }

        if (emailExists) {
            // El correo electrónico ya está en uso, enviar una respuesta de error
            res.status(401).send('EMAIL ALREADY IN USE');
        } else {
            // El correo electrónico no está en uso, permitir el registro
            res.status(200).send('REGISTER OK');
        }
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).send('INTERNAL SERVER ERROR');
    }
});
app.post('/reg', async(req,res) => {

    const nameReg = req.body.name
    const passwordReg = req.body.password
    const query = "INSERT INTO users (username,password,done,correct) VALUES ( '" + nameReg + "' , '" + passwordReg +"',0,0)"
    console.log(query);
    db.query(
        query,
        (err, result) => {
            console.log(err);
    });
});
app.post('/del', async(req,res) => {

    const nameReg = req.body.username
    const query = "delete from users where username = '" + nameReg + "'"
    console.log(query);
    db.query(
        query,
        (err, result) => {
            console.log(err);
    });
});

app.post('/postScore', async(req,res) => {

    const nameReg = req.body.username
    const points = req.body.points;
    const done = req.body.done;
    const query = 
    `
    UPDATE users 
    SET done = done + `+ done +`
    WHERE username = '` + nameReg + `'; 
    UPDATE users 
    SET correct = correct + `+ points +`
    WHERE username = '` + nameReg + `'; 
    `
    console.log(query);
    db.query(
        query,
        (err, result) => {
            console.log(err);
    });
});

app.listen(port, () => {
    console.log(`phonos app listening on port ${port}`);
})
