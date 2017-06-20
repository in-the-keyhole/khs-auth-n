var express = require('express');
var bodyParser = require('body-parser');
var flash = require('req-flash');
var session = require('express-session');

module.exports = api = express();

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({
    extended: true
}));
api.set('views', __dirname + '/views');
api.set('view engine', 'jade');
api.set('view options', {layout: false});
api.use(session({secret: '123'}));
api.use(flash());


api.namespace = '/api';

var apiModule = require('./api/endpoint/api');
apiModule.configure(api);

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;

api.listen(port, function () {
    console.log('API is up and listening on port ' + port);
});