const express = require('express');//Importe le module Express.
const router = express.Router();//objet de routeur Express qui sera utilisé pour définir les routes.

const userCtrl = require('../controllers/user');/*Importe le contrôleur des utilisateurs qui contient les fonctions signup et login 
pour gérer les requêtes d'inscription et de connexion des utilisateurs.*/

router.post('/signup', userCtrl.signup);// Définit une route POST pour l'inscription des utilisateurs
router.post('/login', userCtrl.login);//Définit une route POST pour la connexion des utilisateurs

module.exports = router; //Exporte l'objet de routeur Express afin qu'il puisse être utilisé par d'autres fichiers.