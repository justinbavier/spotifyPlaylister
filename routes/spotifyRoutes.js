var request = require('request');
var querystring = require('querystring');

const spotifyBaseUrl = 'https://api.spotify.com/v1/';

module.exports = app => {
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
      headers: { Authorization: 'Bearer ' + token },
      json: true
    };

    request.get(options, function(error, response, body) {
      res.json(body.genres);
    });
  });

  app.get('/recommendations', function(req, res) {
    let token = req.query.token;
    delete req.query.token;

    let requestUrl =
      spotifyBaseUrl +
      'recommendations?' +
      querystring.stringify({
        limit: 3,
        market: 'from_token'
      }) +
      '&' +
      querystring.stringify(req.query);

    let options = {
      url: requestUrl,
      headers: { Authorization: 'Bearer ' + token },
      json: true
    };

    request.get(options, function(error, response, body) {
      res.json(body);
    });
  });

  // Make a playlist
  app.post('/playlist', function(req, res) {
    let tracks = req.query.tracks;
    let genres = req.query.genres;
    let token = req.query.token;
    let features = req.query.features;
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
          name: displayName + `'s Recommended Tracks`,
          description: 'Recommended tracks based on ' + genres
        }
      };

      request.post(options, function(error, response, body) {
        playlistUrl = body.tracks.href;

        // Add tracks to playlist
        requestUrl =
          playlistUrl +
          '/?' +
          querystring.stringify({
            uris: tracks
          });

        options = {
          url: requestUrl,
          headers: { Authorization: 'Bearer ' + token },
          json: true
        };

        request.post(options, function(error, response, body) {
          res.sendStatus(200);
        });
      });
    });
  });

  app.get('/tracks', function(req, res) {
    let ids = req.query.ids;
    let token = req.query.token;

    let requestURL =
      spotifyBaseUrl +
      'tracks?' +
      querystring.stringify({
        ids: ids,
        market: 'from_token'
      });

    let options = {
      url: requestURL,
      headers: { Authorization: 'Bearer ' + token },
      json: true
    };

    request.get(options, function(error, response, body) {
      res.json(body.tracks);
    });
  });

  // 1. Create Empty Playlist
  app.post('/newPlaylist', function(req, res) {
    let token = req.query.token;
    let playlistName = req.query.playlistName;
    let playlistDescription = req.query.playlistDescription;
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
          name: playlistName,
          description: playlistDescription
        }
      };
      request.post(options, function(error, response, body) {
        res.json(body);
      });
    });
  });

  // 2.
  app.post('/addTracks', function(req, res) {
    let tracks = req.query.tracks;
    //let genres = req.query.genres;
    let token = req.query.token;
    //let features = req.query.features;
    let userId;

    let playlistUrl = req.query.playlistUrl;

    // 3. Add tracks to playlist
    requestUrl =
      playlistUrl +
      '/tracks?' +
      querystring.stringify({
        uris: tracks
      });

    options = {
      url: requestUrl,
      headers: { Authorization: 'Bearer ' + token },
      json: true
    };

    request.post(options, function(error, response, body) {
      res.sendStatus(200);
    });
  });
};
