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

var express = require('express'),
    exphbs  = require('express-handlebars');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/data', function(req, res) {
  redis.hgetall("soba", function(err, obj) {
    data = [['x'],['temp']];
    for(var time in obj) {
      data[0].push(time);
      data[1].push(obj[time]);
    }
    res.send(data);
  });
});

app.get('/add', function(req, res) {
  var timestamp = +req.query.timestamp * 1000;
  var temp = +req.query.temp / 1000.0;

  if(redis.hset("soba", timestamp, temp)) res.send(200);
  else res.send(500);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
