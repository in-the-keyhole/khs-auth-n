var jwt = require('jsonwebtoken');
var fs = require('fs');
var cid = require('uuid/v4')();

module.exports = {

    // sign new JWT with RS256 - expires in 5 mins
    create: function () {
        var payload = {username: "developer"};
        var cert = fs.readFileSync('private_key.pem');
        var signedJWT = jwt.sign(payload, cert, {
            algorithm: 'RS256',
            expiresIn: '5m',
            issuer: 'DST',
            subject: 'developer',
            header: {
                cid: cid
            }
        });

        return signedJWT;
    }
};