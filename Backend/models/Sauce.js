// on requiert mongoose
const mongoose = require('mongoose');

// avec ce code on créé un schéma de données avec toutes les informations dont nos sauces auront besoin
const sauceSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
});


// puis on exporte notre modèle afin qu'il puisse intéragir avec mongoDB
module.exports = mongoose.model('Sauce', sauceSchema);