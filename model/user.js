let db = require('../db_start');

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

    get age()
    {
        return this.row.age;
    }

    get gender()
    {
        return this.row.gender;
    }



    static create (first_name, last_name, user_name, password, email, age, gender, cb){

    }
}




module.exports = User;