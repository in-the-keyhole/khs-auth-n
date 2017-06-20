var express = require('express');
var jwtUtil = require('./jwt-util');
var uuid = require('uuid/v4');
var tldextract = require('tldextract');
var fs = require('fs');

exports.configure = function (api) {

    api.get('/api/v1/authenticate/:token', this.tradeTokenForJWT);

    api.get('/api/v1/certs/:cid', this.publicKey);

    api.get('/favicon.ico', function (req, res) {
        res.status(200);
        res.end();
    });

    api.get("/api/v1/authenticate", function (req, res) {
        res.render("login", {redirect: req.query.redirect_uri, flash: req.flash()});
    });

    api.post('/api/v1/authenticate', function (req, res, next) {
        if (req.body.username && req.body.username === 'developer' && req.body.password && req.body.password === 'developer') {
            req.session.authenticated = true;

            tldextract(req.body.redirect, function (err, obj) {
                var cookieDomain = obj.domain;
                if (obj.tld) {
                    cookieDomain += '.' + obj.tld;
                }
                console.log('cookieDomain:', cookieDomain);
                res.cookie('_dsta', uuid(), {domain: cookieDomain, maxAge: 14400000});
                res.redirect(req.body.redirect);
                console.log('redirected to:', req.body.redirect);
            });
        } else {
            req.flash('error', 'Username and password are incorrect');
            res.redirect('/authenticate');
        }
    });
};

this.tradeTokenForJWT = function (req, res) {
    var token = req.params.token;
    if (token && token !== '7777777') {
        var signedJWT = jwtUtil.create();
        // console.log('created JWT', signedJWT);
        res.status(200).send(signedJWT);
    } else {
        res.status(401).end();
    }
};

this.publicKey = function (req, res) {
    fs.readFile('id_rsa.pub', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        res.status(200).send(data);
    });
};