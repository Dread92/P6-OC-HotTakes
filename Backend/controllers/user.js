const User = require ('../models/User');

// fonction pour enregistrer un nouvel utilisateur
/*nous appelons la fonction de hachage de bcrypt dans notre mot de passe et lui demandons de « saler » le mot de passe 10 fois. 
Plus la valeur est élevée, plus l'exécution de la fonction sera longue, et plus le hachage sera sécurisé*/
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // salt 10 fois
      .then(hash => { // la hashage prenant du temps, on créé une fonction asynchrone
        const user = new User({ // création d'un nouvel utilisateur avec notre modele mongoose
          email: req.body.email, 
          password: hash
        });
        user.save() // on utilise la méthode save pour l'enregistrer dans la base de données
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };

// fonction pour connecter un utilisateur existant

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };