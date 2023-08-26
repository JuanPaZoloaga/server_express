import db from './db.js';
import express from "express"; // module: import from - export, commonjs: require - module.exports = db
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ChatGPTAPI } from "chatgpt";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const port = 8080;
const app = express();

db.query(
  `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      lastname TEXT,
      email TEXT,
      password TEXT
    );
  `
);

app.use(express.json()); // Va a usar un middleware
app.use(cors());
app.listen(port, () => {
  console.log(`Servidor Express iniciado en el puerto ${port}`);
});

const API_AUTH_URL = "/api/auth"

// post es una funcion de un objeto,que recibe 2 parametros string (RUTA),callback (funcion)
app.post(
  `${API_AUTH_URL}/register`, // Literal String
  // funcion anonima
   async function (request, response) {
    // JSON WEB TOKEN -> JWT
    // BD, jsonwebtoken, bcrypt
    // name, lastname, email, password
    // body, params, query
    const { name, email, lastname, password } = request.body;

    // Programacion Defensiva
    try {
      if (name == undefined || email == undefined || lastname == undefined || password == undefined) {
        throw new Error('Necesitamos datos, error');
      }

      const [rows] = await db.query('SELECT * FROM users WHERE email = ?;', [email]);
      // rows -> array -> s
      // no existe -> rows = []
      // existe -> rows = [{ id: 5, email: ?, password: 'asdasda' }]
      // rows[0].id
      
      // Tu defensa
      if (rows.length > 0) {
        throw new Error('Usuario ya existente')
      }

      // javascript moderno ecmascript: let, const
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const encryptedPassword = await bcrypt.hash(password, salt);
            
      // await bcrypt.compare(password, encryptedPassword); , true, sino tira error

      // Tu query
      await db.query('INSERT INTO users (name,lastname,email,password) VALUES (?,?,?,?);', [name,lastname,email,encryptedPassword]);
      
      const [rows2] = await db.query('SELECT * FROM users WHERE email = ?;', [email]);
      const idUser = rows2[0].id;

      const token = jwt.sign(idUser, process.env.PASSWORD_TOKEN);
      response.send(token)
    } catch(err) {
      console.log(err.message);
      response.status(500).send('Ocurrio un error'); // Server Error
    }
  }
);

app.post(`${API_AUTH_URL}/login`,
  // funcion anonima
  async function (req,res){
    const { email,password } = req.body;
    try{
      if (email==undefined || password==undefined)
      throw new Error(`Faltan Datos`)
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?;', [email]); 
      
      if (rows.length>0){
        // const usuario = rows[0]; //xq el 0?y no 4
        const pawword= rows[0].password;      
        let compare= bcrypt.compareSync(password,pawword);
        if(compare){
          console.log("iguales");
          const idUser = rows[0];        
          const token = jwt.sign(idUser, process.env.PASSWORD_TOKEN);
          res.json({ token: token });
        } else{
          console.log("no iguales")
          res.status(404).send('Contraseña incorrecta');
        }
      }else{
        res.status(404).send('Email No encontrador');
      }        

    }catch(err){
      console.log(err.message);
      res.status(500).send('Ocurrio un error');
    }
  }
);
app.get(`/api/gpt/:button`, 
  async (req, res) => {
    const {prompt} = req.query; // Sueño button = 1 o 2 o 3
    const {button} = req.params; // 

    // Configuracion de la API KEY
    const chatgpt = new ChatGPTAPI({
      apiKey: process.env.API_KEY_GPT,
      completionParams:{
        model: `gpt-3.5-turbo`,
      }
    });
    // String(button) // string
    // Number(button) // number
    // Array(button)
    // Object(button)
    let limits = '';
    let query = ``;
    let chatgptResponse = null;

    switch(Number(button)) {
      case 1:   
        // Y despues el envio de la prompt
        limits = '2 parrafos maximo';
        query = `
          Termina la historia:${limits}      
          ${prompt}      
          
        `;
        break;
      case 2:
        // Y despues el envio de la prompt
        limits = '';
        query = `
          finaliza la historia:${limits}      
          ${prompt}     
          
        `;
        break;
        case 3:
          // Y despues el envio de la prompt
        limits = '';
        query = `
          nombrame 10 autos con estas letras:${limits}
      
          ${prompt}
      
          
        `;

      }
      
    chatgptResponse = await chatgpt.sendMessage(query);
    res.status(200).send(chatgptResponse);
  }
);
