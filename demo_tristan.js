// Ton model
const db = require('../db_start');

class User
{
    static function findById(id, callback){
    db.query'('SELECT * FROM user WHERE user_id = ?', id, (err, result) => {
    if (err)
        return callback(err); // Return pour pas que le code continue. Et tu passe l'erreur au controller a lui de la gerer
    callback(null, result[0]); // Sinon callback sans erreur et result[0] car on recup que 1 entre
});
}
}

// Controller
const express = require('express');
const router = express.Router();

router.route('/profile')
    .get((req, res) => {
        User.findById(1, (err, user) => {
            if (err)
                res.send(500).send(err); // Erreur sql du coup err500 avec message
            res.render('profile',  { // On appelle la vue et on lui assigne des var, ici user qui aura comme valeur le retour de notre requete sql
                user: user
            });
        });
    });

module.exports = router;
