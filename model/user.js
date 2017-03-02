let db = require('../db_start');

class User {

    static isUnique(input, value, callback)
    {
        db.query('SELECT COUNT(*) AS count FROM user WHERE ?=?', [input, value], (err, result) => {
            if (err)
            {
                throw err;
            }
            callback(result[0].count);
        });
    }
}

module.exports = User;