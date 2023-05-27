/*Un fichier de contrôleur exporte des méthodes qui sont ensuite attribuées aux routes pour améliorer la maintenabilité de votre application.*/
const Sauce = require('../models/Sauce');// on importe notre schéma de données sauce 
const fs = require('fs');/*Le module fs fournit des méthodes pour effectuer des opérations sur le système de fichiers*/


/*cette fonction crée une nouvelle sauce à partir des données fournies dans la requête,
l'enregistre dans la base de données et renvoie une réponse appropriée.*/
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; /*Ces propriétés ne doivent pas être incluses lors de la création d'une nouvelle sauce,
    car elles seront automatiquement générées par la base de données.*/
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

/*Cette fonction modifie une sauce existante dans la base de données en utilisant les données fournies dans la requête, 
sous réserve de l'autorisation de l'utilisateur.*/
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;//Cette propriété ne doit pas être modifiée lors de la modification d'une sauce.
    Sauce.findOne({ _id: req.params.id })//Recherche la sauce correspondante dans la base de données en utilisant son identifiant.
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {//Vérifie si l'identifiant de l'utilisateur de la sauce est différent de l'identifiant de l'utilisateur authentifié.
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })//Met à jour la sauce dans la base de données en utilisant la méthode updateOne() fournie par Mongoose. 
                    .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};


/*cette fonction supprime une sauce existante de la base de données,
 ainsi que son fichier d'image associé, sous réserve de l'autorisation de l'utilisateur. 
 Elle renvoie une réponse appropriée en fonction du succès ou de l'échec de la suppression.*/
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })//Recherche la sauce correspondante dans la base de données en utilisant son identifiant
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {//Vérifie si l'identifiant de l'utilisateur de la sauce (sauce.userId) est différent de l'identifiant de l'utilisateur authentifié
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];//Extrait le nom de fichier de l'URL de l'image de la sauce en séparant la partie de l'URL après "/images/" avec la méthode "split"
                fs.unlink(`images/${filename}`, () => {//Supprime le fichier d'image de la sauce à partir du système de fichiers en utilisant la fonction fs.unlink()
                    Sauce.deleteOne({ _id: req.params.id })//Supprime la sauce de la base de données en utilisant la méthode deleteOne() fournie par Mongoose.
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};




/*cette fonction récupère les informations d'une sauce spécifique à partir de la base de données en utilisant son identifiant,
 puis renvoie une réponse avec les détails de la sauce si elle est trouvée avec succès. 
 Si la sauce n'est pas trouvée, une réponse avec un statut 404 est renvoyée.*/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/*cette fonction récupère toutes les sauces existantes dans la base de données, 
puis renvoie une réponse avec les détails de toutes les sauces si elles sont trouvées avec succès.
Si une erreur se produit, une réponse avec un statut 400 est renvoyée.*/
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};






//Cette fonction likeSauce est utilisée pour gérer les actions de "j'aime" et "je n'aime pas" sur une sauce spécifique. 
exports.likeSauce = (req, res, next) => {

    const like = req.body.like;
    /* Récupère la valeur du champ like à partir du corps de la requête.
    Cette valeur indique l'action effectuée par l'utilisateur (1 pour "j'aime", -1 pour "je n'aime pas", 0 pour annuler).*/


    if (like === 1) { /* Si like vaut 1, cela signifie que l'utilisateur a cliqué sur le bouton "j'aime". 
    La méthode updateOne est utilisée pour mettre à jour la sauce correspondante dans la base de données.
    Elle incrémente le compteur de likes ($inc: { likes: 1 }),
    ajoute l'identifiant de l'utilisateur dans le tableau usersLiked ($push: { usersLiked: req.body.userId }),
    et renvoie un message de succès.*/ 
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Vous aimez cette sauce' }))
            .catch(error => res.status(400).json({ error }))

    } else if (like === -1) { /*Si like vaut -1, cela signifie que l'utilisateur a cliqué sur le bouton "je n'aime pas". 
    La méthode updateOne est utilisée pour mettre à jour la sauce correspondante dans la base de données.
     Elle incrémente le compteur de dislikes ($inc: { dislikes: 1 }), 
     ajoute l'identifiant de l'utilisateur dans le tableau usersDisliked ($push: { usersDisliked: req.body.userId }), 
     et renvoie un message de succès.*/
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Vous n’aimez pas cette sauce' }))
            .catch(error => res.status(400).json({ error }))


    } else {    /*Si like vaut 0, cela signifie que l'utilisateur a annulé son action précédente (j'aime ou je n'aime pas). 
    La méthode findOne est utilisée pour obtenir la sauce correspondante à l'aide de son identifiant.
    Ensuite, selon l'état précédent de l'utilisateur (like ou dislike), la méthode updateOne est utilisée pour inverser la mise à jour 
    (décrémenter le compteur approprié et retirer l'identifiant de l'utilisateur du tableau correspondant),
    et un message approprié est renvoyé.*/
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Vous n’aimez plus cette sauce' }))
                        .catch(error => res.status(400).json({ error }))
                }
                /* Les promesses .then() et .catch() sont utilisées pour gérer les résultats des opérations de base de données.
                 En cas de succès, une réponse avec un statut 200 et un message approprié est renvoyée. 
                 En cas d'erreur, une réponse avec un statut 400 et l'erreur correspondante est renvoyée.*/
                else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Vous aimerez peut-être cette sauce à nouveau' }))
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
};