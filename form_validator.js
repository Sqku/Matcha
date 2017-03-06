let db = require('./db_start');



class Form_validator {

    static isEmail (input) {
        if (!(input != null)) {
            return false;
        }
        else {
            return input.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
        }

    }

    static isSafePass (input) {
        if (!(input != null)) {
            return false;
        } else {
            return input.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
        }
    }

    static isName (input) {
        if (!(input != null)) {
            return false;
        } else {
            return input.match(/^[a-zA-Z ]{1,20}$/);
        }
    }

    static isUserName (input) {
        if (!(input != null)) {
            return false;
        } else {
            return input.match(/^[a-zA-Z0-9]{1,20}$/);
        }
    }

    static isSamePass (input1, input2) {
        if (!(input1 != null) || !(input2 != null)) {
            return false;
        } else if (input1 === input2) {
            return true;
        }
        else
        {
            return false;
        }
    }

    static isNum (input) {
        if (!(input != null)) {
            return false;
        } else {
            return input.match(/^[0-9]+$/);
        }
    }

    static isUnique(input, value, callback)
    {
        db.query('SELECT COUNT(*) AS count FROM user WHERE ??=?', [input, value], (err, result) => {
            if (err)
            {
                throw err;
            }
            console.log("input= ",input," value = ",value);
            console.log(result);
            callback(result[0].count);
        });
    }

}

module.exports = Form_validator;