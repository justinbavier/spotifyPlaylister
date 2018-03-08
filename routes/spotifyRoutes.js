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
        limit: 20,
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
          name: 'Your brand new playlist',
          description: "It's your playlist!"
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

  // 1. Create Empty Playlist
  // app.post('/newPlaylist', function(req, res) {
  //   let token = req.query.token;
  //   let playlistName = req.query.playlistName;
  //   let userId, playlistUrl;
  //   // Get User Id
  //   let requestUrl = spotifyBaseUrl + 'me';
  //
  //   let options = {
  //     url: requestUrl,
  //     headers: { Authorization: 'Bearer ' + token },
  //     json: true
  //   };
  //
  //   request.get(options, function(error, response, body) {
  //     userId = body.id;
  //     displayName = body.display_name;
  //     // Create Playlist
  //     requestUrl = spotifyBaseUrl + 'users/' + userId + '/playlists';
  //
  //     options = {
  //       url: requestUrl,
  //       headers: {
  //         Authorization: 'Bearer ' + token,
  //         'Content-Type': 'application/json'
  //       },
  //       json: true,
  //       dataType: 'json',
  //       body: {
  //         name: playlistName,
  //         description: "It's your playlist!"
  //       }
  //     };
  //     request.post(options, function(error, response, body) {
  //       console.log(body)
  //     })
  //   });
  // });

  // // 2.
  // app.post('/addTracks', function(req, res) {
  //   let tracks = req.query.tracks;
  //   let genres = req.query.genres;
  //   let token = req.query.token;
  //   let features = req.query.features;
  //   let userId, playlistUrl;
  //
  //   // 1. Get User ID
  //   let requestUrl = spotifyBaseUrl + 'me';
  //
  //   let options = {
  //     url: requestUrl,
  //     headers: { Authorization: 'Bearer ' + token },
  //     json: true
  //   };
  //
  //   request.get(options, function(error, response, body) {
  //     userId = body.id;
  //   });
  //   // 2. Get Playlist ID
  //
  //   // 3. Add tracks to playlist
  // });
};
