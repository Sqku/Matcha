let db = require('../db_start');
let sha256 = require("crypto-js/sha256");
let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alanyu321@gmail.com',
        pass: 'sakuragi1989!'
    }
});


class User {

    static create (user, cb){

        db.query('INSERT INTO user SET ?', user, (err, result) => {
            if (err)
            {
                throw err;
            }
        })
    }

    static defaultProfile(user_id){
        db.query('INSERT INTO profil SET sex_orientation = "bisexual", user_id = ?', [user_id], (err, result) => {
            if(err)
                throw err;
        })
    }

    static findProfile(user_id, cb){
        db.query('SELECT * FROM profil WHERE user_id = ?', [user_id], (err, result) => {
            if(err)
                throw err;
            cb(result[0]);
        })
    }

    static updateProfil(profile, cb){
        db.query('UPDATE profil SET sex_orientation = ?, bio = ? WHERE user_id = ?', [profile.sex_orientation, profile.bio, profile.user_id], (err, result) => {
            if(err)
                throw err;
            // cb();
        })
    }

    static updateUser(user, cb){
        db.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, gender = ? WHERE id = ?', [user.first_name, user.last_name, user.email, user.gender, user.id], (err, result) => {
            if(err)
                throw err;
            // cb();
        })
    }

    static sendEmail(email, token, host, user_name){

        let link = "http://"+host+"/validate?token="+token+"&user_name="+user_name;

        let mailOptions = {
            from: 'Matcha', // sender address
            to: email, // list of receivers
            subject: 'Matcha - Account Validation', // Subject line
            text: 'Welcome to Matcha,\n\n\n' +
            'to validate your account, please click the link below or copy/paste to your browser :\n\n' +link, // plain text body
            // html: '<b>Hello world ?</b>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }

    static validate(user_name, cb){
        db.query('SELECT token, activated FROM user WHERE user_name = ?', [user_name], (err, result) => {
            if (err)
                throw err;
            cb(result[0]);
        } )
    }

    static activation(user_name, cb){
        db.query('UPDATE user SET activated = 1, token = "" WHERE user_name = ?', [user_name], (err, result) => {
            if (err)
                throw err;
            cb();
        })
    }

    static findUser(user_name, cb){
        db.query('SELECT * FROM user WHERE user_name = ?', [user_name], (err, result) => {
            if (err)
                throw err;
            cb(result[0]);
        })
    }

    static getTags(cb){
        db.query('SELECT tag FROM interets', (err, result) => {
            if(err)
                throw err;
            cb(result);
        })
    }
    // 'SELECT messages.user_id, messages.message, messages.created_at FROM messages LEFT JOIN user ON user.id = messages.user_id LIMIT 30'
    static findUserTags(user_id, cb){
        db.query('SELECT tag FROM interets LEFT JOIN user_interet ON interets.id = user_interet.interets_id WHERE user_interet.user_id = ?', [user_id], (err, result) => {
            if(err)
                throw err;
            cb(result);
        })
    }

    static createTags(tag, cb){
        db.query('INSERT INTO interets SET tag = ?', [tag], (err, result) => {
            if(err)
                throw err;
        })
    }

    static isUniqueTag(input, value, cb)
    {
        db.query('SELECT COUNT(*) AS count FROM interets WHERE ??=?', [input, value], (err, result) => {
            if (err)
            {
                throw err;
            }
            cb(result[0].count);
        });
    }

    static getTagid(tag, cb)
    {
        db.query('SELECT * FROM interets WHERE tag = ?', [tag], (err, result) => {
            if (err)
                throw err;
            cb(result[0]);
        });
    }

    static addUserTags(interets_id, user_id, cb)
    {
        db.query('REPLACE INTO user_interet SET interets_id = ?, user_id = ?', [interets_id, user_id], (err, result) => {
            if (err)
                throw err;
        })
    }

    static deleteUserTags(interets_id, user_id, cb)
    {
        db.query('DELETE FROM user_interet WHERE EXISTS (SELECT * FROM interets WHERE interets.id = ? AND user_interet.user_id = ?)', [interets_id, user_id], (err, result) => {
            if (err)
                throw err;
        })
    }

    static getUserImages(user_id, cb)
    {
        db.query('SELECT * FROM images WHERE user_id = ?', [user_id], (err, result) => {
            if (err)
                throw err;
            cb(result);
        })
    }

    static addUserImages(img, user_id, cb)
    {
        db.query('INSERT INTO images SET img = ?, user_id = ?', [img, user_id], (err, result) => {
            if (err)
                throw err;
        });
        cb();
    }

    static countUserImages(user_id, cb)
    {
        db.query('SELECT COUNT(*) AS count FROM images WHERE user_id = ?', [user_id], (err, result) => {
            if (err)
                throw err;
            cb(result[0].count);
        })
    }

    static updateProfilePicture(profile_picture, user_id, cb)
    {
        db.query('UPDATE profil SET profile_picture = ? WHERE user_id = ?', [profile_picture, user_id], (err, result) => {
            if (err)
                throw err;
        })
    }

    static deleteUserImages(img, user_id, cb)
    {
        db.query('DELETE FROM images WHERE img = ? AND user_id = ?', [img, user_id], (err, result) => {
            if (err)
                throw err;
        })
    }

    static updateUserLocation(lat, lng, city, departement, country, user_id, cb)
    {
        db.query('UPDATE profil SET lat = ?, lng = ?, city = ?, departement = ?, country = ? WHERE user_id = ?', [lat, lng, city, departement, country, user_id], (err, result) => {
            if (err)
                throw err;
        })
    }

    static getAllUsers(cb)
    {
        db.query('SELECT id, user_name FROM user', (err, result) => {
            if(err)
                throw err;
            cb(result);
        })
    }

    static getAllprofiles(cb)
    {
        db.query('SELECT user_id, profile_picture, user_name FROM profil AS p, user AS u WHERE p.user_id = u.id AND u.activated = 1', (err, result) => {
            if(err)
                throw err;
            cb(result);
        })
    }

    static setLike(like_user_id, liked_user_id, cb)
    {
        db.query('INSERT INTO `like` SET like_user_id = ?, liked_user_id = ?', [like_user_id, liked_user_id], (err, result) => {
            if(err)
                throw err;
        })
    }

    static isLiked(like_user_id, liked_user_id, cb)
    {
        db.query('SELECT COUNT(*) AS count FROM `like` AS l WHERE l.like_user_id = ? AND l.liked_user_id = ?', [like_user_id, liked_user_id], (err, result) => {
            if(err)
                throw err;
            cb(result[0].count);
        })
    }

    static isMatch(like_user_id, liked_user_id, cb)
    {
        db.query('SELECT COUNT(*) AS count FROM `like` AS l WHERE (l.like_user_id = ? AND l.liked_user_id = ?) OR (l.like_user_id = ? AND l.liked_user_id = ?)', [like_user_id, liked_user_id, liked_user_id, like_user_id], (err, result) => {
            if(err)
                throw err;
            cb(result[0].count);
        })
    }

    static disLike(like_user_id, liked_user_id, cb)
    {
        db.query('DELETE FROM `like` WHERE like_user_id = ? AND liked_user_id = ?', [like_user_id, liked_user_id], (err, result) => {
            if(err)
                throw err;
        })
    }

    static countLike(liked_user_id, cb)
    {
        db.query('SELECT COUNT(*) AS count FROM `like` WHERE liked_user_id = ?', [liked_user_id], (err, result) => {
            if (err)
                throw err;
            cb(result[0].count);
        })
    }

    static setBlock(block_user_id, blocked_user_id, cb)
    {
        db.query('INSERT INTO `block` SET block_user_id = ?, blocked_user_id = ?', [block_user_id, blocked_user_id], (err, result) => {
            if(err)
                throw err;
        })
    }

    static isBlocked(block_user_id, blocked_user_id, cb)
    {
        db.query('SELECT COUNT(*) AS count FROM `block` AS b WHERE b.block_user_id = ? AND b.blocked_user_id = ?', [block_user_id, blocked_user_id], (err, result) => {
            if(err)
                throw err;
            cb(result[0].count);
        })
    }

    static unBlock(block_user_id, blocked_user_id, cb)
    {
        db.query('DELETE FROM `block` WHERE block_user_id = ? AND blocked_user_id = ?', [block_user_id, blocked_user_id], (err, result) => {
            if(err)
                throw err;
        })
    }

    static locationProfiles(user_id, mylat, mylng, dist, cb)
    {
        let lng_1 = mylng - dist / Math.abs(Math.cos(mylat * (Math.PI / 180)) * 69);
        let lng_2 = mylng + dist / Math.abs(Math.cos(mylat * (Math.PI / 180)) * 69);
        let lat_1 = mylat - (dist/69);
        let lat_2 = mylat + (dist/69);

        // console.log(lng_1, lng_2, lat_1, lat_2)
        db.query('SELECT profil.*, 3956 * 2 * ASIN(SQRT( POWER(SIN(( ? - profil.lat) *  pi()/180 / 2), 2) + COS(? * pi()/180) * COS(profil.lat * pi()/180) * POWER(SIN((? - profil.lng) * pi()/180 / 2), 2) )) as distance FROM profil WHERE profil.lng between ? and ? and profil.lat between ? and ? HAVING distance < ? ORDER BY distance',
            [mylat, mylat, mylng, lng_1, lng_2, lat_1, lat_2, dist], (err, result) => {
            if(err)
                throw err;
            cb(result);
            });
    }

    static suggestedProfiles(user_id, sex_orientation, sexe, cb)
    {
        let gender = "";
        if(sex_orientation == "bisexual" && sexe == "woman")
            gender = 'WHERE (user.gender = "man" OR user.gender = "woman") AND';
        else if(sex_orientation == "bisexual" && sexe == "man" )
            gender = 'WHERE (user.gender = "man" OR user.gender = "woman") AND';
        else if (sex_orientation == "homosexual" && sexe == "woman" )
            gender = 'WHERE (user.gender = "woman" AND (profil.sex_orientation = "homosexual" OR profil.sex_orientation = "bisexual")) AND';
        else if (sex_orientation == "homosexual" && sexe == "man" )
            gender = 'WHERE (user.gender = "man" AND (profil.sex_orientation = "homosexual" OR profil.sex_orientation = "bisexual")) AND';
        else if (sex_orientation == "heterosexual" && sexe == "woman" )
            gender = 'WHERE (user.gender = "man" AND (profil.sex_orientation = "heterosexual" OR profil.sex_orientation = "bisexual")) AND';
        else if (sex_orientation == "heterosexual" && sexe == "man" )
            gender = 'WHERE (user.gender = "woman" AND (profil.sex_orientation = "heterosexual" OR profil.sex_orientation = "bisexual")) AND';
        db.query('SELECT profil.*, user.score, user.gender, user.date_of_birth, user.activated FROM profil, user ' + gender + ' profil.user_id = user.id AND user.activated = 1 AND NOT EXISTS (SELECT * FROM `block` AS b WHERE b.block_user_id = ? AND b.blocked_user_id = user.id)',
            [user_id], (err, result) => {
            if(err)
                throw err;
            cb(result);
        })
    }

    static userStatus(user_id, status, cb)
    {
        db.query('UPDATE profil SET online = ? WHERE profil.user_id = ?', [status, user_id], (err, result) => {
            if (err)
                throw err;
        })
    }

    static setVisit(like_user_id, liked_user_id, cb)
    {
        db.query('INSERT INTO `visit` SET visit_user_id = ?, visited_user_id = ?', [like_user_id, liked_user_id], (err, result) => {
            if(err)
                throw err;
        })
    }

    static isVisited(like_user_id, liked_user_id, cb)
    {
        db.query('SELECT COUNT(*) AS count FROM `visit` AS l WHERE l.visit_user_id = ? AND l.visited_user_id = ?', [like_user_id, liked_user_id], (err, result) => {
            if(err)
                throw err;
            cb(result[0].count);
        })
    }


}

module.exports = User;