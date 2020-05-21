const bcrypt = require("bcrypt");

module.exports = {
    encrypt(password) {
        return new Promise(function(resolve, reject) {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) return reject(err);
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) return reject(err);
                    resolve(hash);
                })
            })
        })
    },
    compare(password, hash) {
        return new Promise(function(resolve, reject) {
            bcrypt.compare(password, hash, function(err, success) {
                if (err) return reject(err);
                resolve(success);
             });
        })
    }
}