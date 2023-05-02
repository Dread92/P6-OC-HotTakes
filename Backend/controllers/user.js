const User = require ('../models/User');
const jwt = require('jsonwebtoken');

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
                     /*Nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur 
                    avec le hash enregistré dans la base de données*/
                    if (!valid) {
                        /*S'ils ne correspondent pas, nous renvoyons une erreur401 Unauthorized avec le même message que lorsque l’utilisateur n’a pas été trouvé,
                        afin de ne pas laisser quelqu’un vérifier si une autre personne est inscrite sur notre site.*/
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    /*S'ils correspondent, les informations d'identification de notre utilisateur sont valides. 
                    Dans ce cas, nous renvoyons une réponse 200 contenant l'ID utilisateur et un token*/
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' })
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };