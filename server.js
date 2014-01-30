var express = require('express');
var path    = require('path');
var http    = require('http');
var request = require('request');
var cheerio = require('cheerio');
var _       = require('lodash');

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

app.get('/api/game', function(req, res) {
    return requestPeople(function(data) {
        return res.send(data);
    });
});

//# Kick off the server ----------------------------------------------------------
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var requestPeople = function(fn) {
    var url = 'http://www.willowtreeapps.com/company/';

    request(url, function(err, resp, body) {
        if (err) { throw err; }

        var $ = cheerio.load(body);

        var people = [];

        $('.team_member').each(function() {
            var $el = $(this);

            var names = []

            names.push($el.find('.info h3').text());

            names.push($el.find('img.attachment-full')
                            .attr('alt')
                            .split('_')
                            .slice(1)
                            .map(cap)
                            .join(' '));

            names.push($el.find('img.attachment-full')
                            .attr('src')
                            .split('/')
                            .pop()
                            .replace('.jpg', '')
                            .replace('.png', '')
                            .replace(/[0-9]/, '')
                            .replace(/headshot/i, '')
                            .replace('  ', ' ')
                            .split('_')
                            .map(cap)
                            .join(' '));

            names = _.sortBy(names, function(s) {
                return -s.length;
            });

            var url = $el.find('img.attachment-full').attr('src');

            people.push({
                name: names[0],
                url: url
            });
        });

        var random = _(people).shuffle().first(5).value();
        var selected = random[0];
        random = _.shuffle(random);

        fn({
            selected: selected,
            pool: random
        });
    });
}

function cap(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
