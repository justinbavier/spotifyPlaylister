// Introducing the Node Modules
var express = require('express');
var path = require('path');

var app = express();

require('./routes/spotifyRoutes')(app);
require('./routes/navRoutes')(app);
// require('./routes/mailRoutes')(app);

app.use(express.static(__dirname + '/public'));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const PORT = process.env.PORT || 5000;
app.listen(PORT);

console.log('It lives on port ' + PORT + '!');
