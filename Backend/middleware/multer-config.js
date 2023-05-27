//require multer pour la suite du code
const multer = require('multer');
//on déclare les types de fichiers que nous acceptons 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

//ce code configure Multer pour gérer le stockage des fichiers téléchargés sur le disque. 
//on peut gérer à la fois la direction du fichier mais aussi modifier son nom afin d'éviter les duplicatas si un autre user venait à upload une image avec le même nom.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
 
  }
});

//On exporte ce middleware dans d'autres parties de l'application pour gérer les téléchargements d'images.
module.exports = multer({storage: storage}).single('image');