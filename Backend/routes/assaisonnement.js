const express = require('express');
const router = express.Router(); // La méthode express.Router()  nous permet de créer des routeurs séparés pour chaque route principale de notre application
const Sauce = require('../models/Sauce');
const sauceCtrl = require('../controllers/assaisonnement.js');
const auth = require('../middleware/auth');
const multer= require('../middleware/multer-config');
// On exporte notre "router" pour qu'il soit utilisé autre part
module.exports = router;

// Middlewares//
  // on utilise la méthode post pour intercepter les requêtes post
  //Ici, on créé une instance de notre modèle Sauce en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé (en ayant supprimé en amont le faux_id envoyé par le front-end).
  router.post('/',auth,multer, sauceCtrl.createSauce );

  /*Nous exploitons la méthode updateOne() dans notre modèle Sauce .
   Cela nous permet de mettre à jour le Sauce qui correspond à l'objet que nous passons comme premier argument.
    Nous utilisons aussi le paramètre id passé dans la demande, et le remplaçons par le Sauce passé comme second argument.*/
  router.put('/:id',auth, sauceCtrl.modifySauce );

/*La méthode deleteOne() de notre modèle fonctionne comme findOne() et updateOne() dans le sens où nous lui passons un objet correspondant au document à supprimer.
 Nous envoyons ensuite une réponse de réussite ou d'échec au front-end. */
  router.delete('/:id',auth,sauceCtrl.deleteSauce);

  /*nous utilisons la méthode get() pour répondre uniquement aux demandes GET à cet endpoint ;
nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre ;
nous utilisons ensuite la méthode findOne() dans notre modèle Sauce pour trouver le Sauce unique ayant le même _id que le paramètre de la requête ;
ce Thing est ensuite retourné dans une Promise et envoyé au front-end ;
si aucune Sauce n'est trouvée ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.*/
  router.get('/:id', auth,sauceCtrl.getOneSauce );

  // nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les "sauces" dans notre base de données
  router.get('/', auth,sauceCtrl.getAllSauce );

