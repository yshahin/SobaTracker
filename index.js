var redis = null;
if (process.env.REDISCLOUD_URL) {
  var rtg   = require("url").parse(process.env.REDISCLOUD_URL);
  redis = require("redis").createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);
} else {
  redis = require("redis").createClient();
}

redis.on("error", function (err) {
  console.log("Error " + err);
});

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send(redis.keys("*_*"));
});

app.get('/add', function(request, response) {
  var timestamp = request.query.timestamp;
  var temp = +request.query.temp / 1000.0;
  var key = timestamp + "_" + temp

  redis.set(key, key);
  response.send(200);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
