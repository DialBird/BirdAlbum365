
var express = require('express'),
    compression = require('compression'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser');

var routes = require('./routes/index'),
    smartphone = require('./routes/smartphone'),
    PC = require('./routes/PC');

var app = express();

app.set('views', path.join(__dirname,'views'));
app.set('view engine','jade');

//app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/PC', PC);
app.use('/smartphone', smartphone);

module.exports = app;