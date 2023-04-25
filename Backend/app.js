const express = require('express'); // on require express, précédemment installé
const app = express(); // on créé une constante app = express puis l'exporter afin de pouvoir l'utiliser depuis d'autres fichiers.
module.exports = app;



// Middlewares
/*le premier enregistre « Requête reçue ! » dans la console et passe l'exécution ;
le deuxième ajoute un code d'état 201 à la réponse et passe l'exécution ;
le troisième envoie la réponse JSON et passe l'exécution ;
le dernier élément de middleware enregistre « Réponse envoyée avec succès ! » dans la console.*/

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next(); // rajouter next est important pour passer à la prochaine fonction, sans quoi la requête ne se termine jamais
  });

  app.use((req, res, next) => {
    res.status(201); // on utilise un code 201 pour la requête http
    next();
  });

// on utilise la méthode .use, l'application utilisera cette méthode pour tout type de requête
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' }); // réponse en json ( objet res.json) :confirmation que notre requête est reçue 
    next();
 });

 // Dans ce cas de figure, on utilise pas next car c'est le dernier middleware, il n'y a plus rien après
 app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
  });