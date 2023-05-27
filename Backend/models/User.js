//On importe le module Mongoose, qui est utilisé pour interagir avec MongoDB dans Node.js.
const mongoose = require('mongoose');
// plugin Mongoose permettant de valider l'unicité des champs dans les schémas. Il est utilisé ici pour valider l'unicité de l'attribut email.
const uniqueValidator = require('mongoose-unique-validator'); 


//définit un nouveau schéma Mongoose pour l'utilisateur
//Pour s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail, nous utiliserons le mot clé unique pour l'attribut email du schéma d'utilisateur userSchema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//applique le plugin mongoose-unique-validator au schéma d'utilisateur
userSchema.plugin(uniqueValidator);

//On exporte le modèle d'utilisateur enregistré dans Mongoose
module.exports = mongoose.model('User', userSchema);