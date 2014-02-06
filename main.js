// Node Libs
var http = require('http');

// Third Party Libs
var _ = require('lodash');
var express = require('express');

//# Configure the app ------------------------------------------------------------
var app = express();
app.set('port', Number(process.env.PORT || 2000));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

//# Routes -----------------------------------------------------------------------
app.get('/', function(req, res) {
    return res.send('Hello World!');
});

//# Kick off the server ----------------------------------------------------------
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

