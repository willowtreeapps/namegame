var express = require('express');
var path = require('path');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var cors = require('cors')

//# Configure the app ------------------------------------------------------------
var app = express();
app.set('port', Number(process.env.PORT || 2000));
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, './public')));

//# Routes -----------------------------------------------------------------------
app.get('/api/game', cors(), function(req, res) {
    return res.send({
        people: people
    });
});

//# Kick off the server ----------------------------------------------------------
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var people = [];

// Refresh our list of people every day
setInterval(requestPeople, 1000 * 60 * 60 * 24);


var requestPeople = function(fn) {
    var url = 'https://willowtreeapps.com/api/v1.0/profiles';

    request(url, { json: true }, function(err, resp, body) {
        if (err) { throw err; }

        people = [];

        if (body && body.items) {
            people = body.items;
        }
    });
}

requestPeople();