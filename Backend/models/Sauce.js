// on requiert mongoose
const mongoose = require('mongoose');

// avec ce code on créé un schéma de données avec toutes les informations dont nos sauces auront besoin
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0 },
    userId: { type: String },
    usersLiked: [String],
    usersDisliked: [String] ,
});


// puis on exporte notre modèle afin qu'il puisse intéragir avec mongoDB
module.exports = mongoose.model('Sauce', sauceSchema);