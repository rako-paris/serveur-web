var express         = require('express');
var app             = express();
var router          = require('./routes/index');
var config          = require('./config/config');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

//CROSS DOMAIN
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.json({
  type: 'application/json',
	limit: '50mb',
  parameterLimit: 5000000,
  extended: true
})); 

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended:'true',
  parameterLimit: 5000000,
  type: 'application/x-www-form-urlencoded'
}));

app.use(methodOverride());


app.use('/api', router);

app.listen(7000);
console.log("App listening on port 7000");
