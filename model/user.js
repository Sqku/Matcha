let db = require('../db_start');
let sha256 = require("crypto-js/sha256");

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
    static create (user){

        let key = sha256(user.email + Date.now());

        db.query('INSERT INTO user SET first_name = ?, last_name = ?, user_name = ?, password = ?, email = ?, date_of_birth = ?, gender = ?, salt = ?, key = ?',
            [
                user.first_name,
                user.last_name,
                user.user_name,
                user.password,
                user.email,
                user.date_of_birth,
                user.gender,
                user.salt,
                key
            ],
            (err, result) => {
                if (err)
                {
                    throw err;
                }
        })
    }
}




module.exports = User;