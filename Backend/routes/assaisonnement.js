const express = require('express');
const router = express.Router(); // La méthode express.Router()  nous permet de créer des routeurs séparés pour chaque route principale de notre application
const Sauce = require('../models/Sauce');
const sauceCtrl = require('../controllers/assaisonnement.js');
const auth = require('../middleware/auth');
const multer= require('../middleware/multer-config');


// On exporte notre "router" pour qu'il soit utilisé autre part
  module.exports = router;
  router.post('/',auth,multer, sauceCtrl.createSauce );
  router.put('/:id',auth,multer, sauceCtrl.modifySauce );
  router.delete('/:id',auth,sauceCtrl.deleteSauce);
  router.get('/:id', auth,sauceCtrl.getOneSauce );
  router.get('/', auth,sauceCtrl.getAllSauce );
  router.post('/:id/like', auth, sauceCtrl.likeSauce);
