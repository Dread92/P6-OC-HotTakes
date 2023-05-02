const express = require('express'); // on require express, précédemment installé
const app = express(); // on créé une constante app = express puis l'exporter afin de pouvoir l'utiliser depuis d'autres fichiers.
module.exports = app;
const mongoose = require('mongoose'); // on installe mongoose pour notre base de données.
//avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :
app.use(express.json());
require('dotenv').config();
const Sauce = require('./models/Sauce.js');
const sauceRoutes = require('./routes/assaisonnement');
const userRoutes = require('./routes/user');


//Connexion à MongoDB
const password= process.env.DB_PASSWORD // on passe le password présent dans env pour éviter qu'il soit visible
const username = process.env.DB_USERNAME // on passe également le user name depuis le fichier .env
const databasename= process.env.DB_DATABASENAME
mongoose.connect(`mongodb+srv://${username}:${password}@${databasename}/?retryWrites=true&w=majority` ,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



//Middlewares// 

// header qui va permettre d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
//d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
//d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use('/api/stuff', sauceRoutes);
  
app.use('/api/auth', userRoutes);