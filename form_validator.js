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

    static isDate (input) {
        if (!(input != null)) {
            return false;
        } else {
            return input.match(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/);
        }
    }

    static isDateofBirth (input) {
        if (!this.isDate (input)){
            return false;
        } else {
            let dateSplit = input.split("/");
            let now = new Date();

            console.log("Age : ", (now.getFullYear() - parseInt(dateSplit[2])));
            if (now.getFullYear() - parseInt(dateSplit[2]) > 18 )
            {
                return true;
            }
            else if (now.getFullYear() - parseInt(dateSplit[2]) == 18 )
            {
                console.log("Mois : ", (now.getMonth() - (parseInt(dateSplit[1]) - 1)));
                if(now.getMonth() - (parseInt(dateSplit[1]) - 1)  > 0)
                {
                    return true;
                }
                else if (now.getMonth() - (parseInt(dateSplit[1]) - 1)  == 0)
                {
                    console.log("jour : ", (now.getDate() - (parseInt(dateSplit[0]))));
                    return(now.getDate() - parseInt(dateSplit[0]) >= 0);
                }
                else
                    return false;
            }
            else
                return false;
        }
    }

    static isUnique(input, value, callback)
    {
        db.query('SELECT COUNT(*) AS count FROM user WHERE ??=?', [input, value], (err, result) => {
            if (err)
            {
                throw err;
            }
            // console.log("input= ",input," value = ",value);
            // console.log(result);
            callback(result[0].count);
        });
    }

}

module.exports = Form_validator;