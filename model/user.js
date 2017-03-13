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

    constructor (row) {
        this.row = row;
    }

    get first_name()
    {
        return this.row.first_name;
    }

    get last_name()
    {
        return this.row.last_name;
    }

    get user_name()
    {
        return this.row.user_name;
    }

    get password()
    {
        return this.row.password;
    }

    get email()
    {
        return this.row.email;
    }

    get date_of_birth()
    {
        return this.row.date_of_birth;
    }

    get gender()
    {
        return this.row.gender;
    }

    get salt()
    {
        return this.row.gender;
    }

    get date_creation()
    {
        return this.row.gender
    }



    // static create (first_name, last_name, user_name, password, email, date_of_birth, gender, salt, cb){
    //     db.query('INSERT INTO user SET first_name = ?, last_name = ?, user_name = ?, password = ?, email = ?, age = ?, gender = ?, salt = ?', [])
    // }
    static create (user, cb){



        db.query('INSERT INTO user SET ?',
            user,
            (err, result) => {
                if (err)
                {
                    throw err;
                }
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
        db.query('SELECT password, salt, activated FROM user WHERE user_name = ?', [user_name], (err, result) => {
            if (err)
                throw err;
            cb(result[0]);
        })
    }
}




module.exports = User;