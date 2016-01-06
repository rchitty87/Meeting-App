require('./db/connect');
var express = require('express');
var bodyParser = require('body-parser');
var roomRoutes = require('./routes/room');
var socketBinding = require('./services/socket-io');
var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', roomRoutes);
app.use('*', function(req, res){
  res.status(404).json({ message: 'Not Found' });
});

app.listen(8080, function() {
  console.log('Listening on port 8080');
});

socketBinding.connectSocket(require('http').Server(app));
console.log('bound');

exports.app = app;
