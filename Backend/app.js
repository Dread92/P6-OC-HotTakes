const express = require('express'); // on require express, précédemment installé
const app = express(); // on créé une constante app = express puis l'exporter afin de pouvoir l'utiliser depuis d'autres fichiers.
module.exports = app;
const mongoose = require('mongoose'); // on installe mongoose pour notre base de données.
//avec ceci, Express prend toutes les requêtes qui ont comme Content-Type  application/json  et met à disposition leur  body  directement sur l'objet req, ce qui nous permet d'écrire le middleware POST suivant :
app.use(express.json());
require('dotenv').config();
const Sauce = require('./models/Sauce.js');

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


  // on utilise la méthode post pour intercepter les requêtes post
  //Ici, on créé une instance de notre modèle Sauce en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé (en ayant supprimé en amont le faux_id envoyé par le front-end).
  app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
      ...req.body
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
      .catch(error => res.status(400).json({ error }));
  });

  /*nous utilisons la méthode get() pour répondre uniquement aux demandes GET à cet endpoint ;
nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre ;
nous utilisons ensuite la méthode findOne() dans notre modèle Sauce pour trouver le Sauce unique ayant le même _id que le paramètre de la requête ;
ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;
si aucune Sauce n'est trouvée ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.*/
  app.get('/api/stuff/:id', (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  });

  // nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les "sauces" dans notre base de données
  app.get('/api/stuff', (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  });

