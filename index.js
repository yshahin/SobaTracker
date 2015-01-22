var redis = require("redis").createClient();
var client = null;

if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  client = redis.createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);
} else {
  client = redis.createClient();
}

redis.on("error", function (err) {
  console.log("Error " + err);
});

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/add', function(request, response) {
  var timestamp = req.query.timestamp;
  var date = new Date(timestamp*1000);
  var temp = +req.query.temp;
  temp = temp / 1000.0;

  response.send(date + ': ' + temp);
  //client.set("", "");
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
