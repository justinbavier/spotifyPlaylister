// Introducing the Node Modules
var express = require('express');
var request = require('request');
var querystring = require('querystring');

var app = express();

const spotifyBaseUrl = 'https://api.spotify.com/v1/';

app.use(express.static(__dirname + '/public'));

// Get our user
app.get('/user', function(req, res) {
  let token = req.query.token;

  let requestUrl = spotifyBaseUrl + 'me';

  let options = {
    url: requestUrl,
    headers: { Authorization: 'Bearer ' + token },
    json: true
  };

  request.get(options, function(error, response, body) {
    res.json(body);
  });
});

// List all available genres for recommendation seeds
app.get('/genres', function(req, res) {
  let token = req.query.token;
  let requestUrl = spotifyBaseUrl + 'recommendations/available-genre-seeds';

  let options = {
    url: requestUrl,
    headers: { 'Authorization': 'Bearer ' + token },
    json: true
  };

  request.get(options, function(error, response, body) {
    res.json(body.genres);
  });
});



// Make that sucker a playlist
app.post('/playlist', function(req, res) {
  let token = req.query.token;
  let userId, playlistUrl;

  // Get User Id
  let requestUrl = spotifyBaseUrl + 'me';

  let options = {
    url: requestUrl,
    headers: { Authorization: 'Bearer ' + token },
    json: true
  };

  request.get(options, function(error, response, body) {
    userId = body.id;
    displayName = body.display_name;
    console.log(body);
    console.log('Creating playlist for ' + displayName);

    // Create Playlist
    requestUrl = spotifyBaseUrl + 'users/' + userId + '/playlists';

    options = {
      url: requestUrl,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      json: true,
      dataType: 'json',
      body: {
        name: 'Playlist just for ' + displayName + '!!!',
        description: "It's your playlist!"
      }
    };

    request.post(options, function(error, response, body) {
      playlistUrl = body.tracks.href;
      res.sendStatus(200);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

console.log('It lives on port ' + PORT + '!');
