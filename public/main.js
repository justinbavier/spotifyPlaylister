// Check hash for token
const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = 'b8f7c75be8df4476bbd74e05fe622524';
// const redirectUri = 'http://crosshair-playlist.herokuapp.com';
const redirectUri = 'http://localhost:5000';
const scopes = [
  'streaming',
  'user-read-birthdate',
  'user-read-email',
  'user-read-private',
  'playlist-modify-public',
  'user-modify-playback-state'
];

// If there is no token, redirect to Spotify Authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
    '%20'
  )}&response_type=token`;
}

// Page Setup
showUser();
setUpSliders();

$(function () {
  $('[data-toggle="popover"]').popover()
});

// Button Functions
$('#logout-button').click(function() {
  logout();
  return false;
});

$('#submit-button').click(function() {
  makePlaylist();
  return false;
});

function showUser() {
  $.get('/user?token=' + _token, function(user) {
    $('#current-user').text(user.id);
    $('#display-name').text(user.display_name);
  });
}

// Need to make this a more streamlined process
// Currently opens logout page in new tab
// Logout only truly happens upon manual refresh
function logout() {
  _token = null;
  window.open('https://accounts.spotify.com/logout');
  location.reload();
}

function getGenresList() {
  $('#genres-list').empty();
  $.get('/genres?token=' + _token, function(genres) {
    i = 0;
    genres.forEach(function(genre) {
      if (i % 5 == 0) {
        // let startRow = '<div class="row">';
        let genreButtonElement =
          '<label class="btn genre-button btn-gray btn-sm"><input type="checkbox" value="' +
          genre +
          '">' +
          genre +
          '</label>';
        $('#genres-list')
          // .append(startRow)
          .append(genreButtonElement);
        i++;
      } else if ((i + 1) % 5 == 0) {
        // let endRow = '</div>';
        let genreButtonElement =
          '<label class="btn genre-button btn-gray btn-sm"><input type="checkbox" value="' +
          genre +
          '">' +
          genre +
          '</label>';
        $('#genres-list').append(genreButtonElement);
        // .append(endRow);
        i++;
      } else {
        let genreButtonElement =
          '<label class="btn genre-button btn-gray btn-sm"><input type="checkbox" value="' +
          genre +
          '">' +
          genre +
          '</label>';
        $('#genres-list').append(genreButtonElement);
        i++;
      }
    });
  });
}

function setUpSliders() {
  $('#positivity-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: .5,
    stop: function() {
      getRecommendations();
    }
  });
  $('#energy-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: .3,
    stop: function() {
      getRecommendations();
    }
  });
  $('#acousticness-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: .65,
    stop: function() {
      getRecommendations();
    }
  });
  $('#danceability-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: .55,
    stop: function() {
      getRecommendations();
    }
  });
  $('#instrumentalness-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: .4,
    stop: function() {
      getRecommendations();
    }
  });
  $('#liveness-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: .6,
    stop: function() {
      getRecommendations();
    }
  });
  $('#speechiness-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: .5,
    stop: function() {
      getRecommendations();
    }
  });

  $('#popularity-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 100,
    step: 1,
    value: 40,
    stop: function() {
      getRecommendations()
    }
  });
}

function getSliderValues() {
  let values = {};

  let target_popularity = $('#popularity-slider').slider('values', 0);
  let target_positivity = $('#positivity-slider').slider('values', 0);
  let target_energy = $('#energy-slider').slider('values', 0);
  let target_acousticness = $('#acousticness-slider').slider('values', 0);
  let target_danceability = $('#danceability-slider').slider('values', 0);
  let target_instrumentalness = $('#instrumentalness-slider').slider(
    'values',
    0
  );
  let target_liveness = $('#liveness-slider').slider('values', 0);
  let target_speechiness = $('#speechiness-slider').slider('values', 0);

  values['target_popularity'] = target_popularity;
  values['target_positivity'] = target_positivity;
  values['target_energy'] = target_energy;
  values['target_acousticness'] = target_acousticness;
  values['target_danceability'] = target_danceability;
  values['target_instrumentalness'] = target_instrumentalness;
  values['target_liveness'] = target_liveness;
  values['target_speechiness'] = target_speechiness;

  return values;
}

function getRecommendations() {
  // Get selected genres
  let genres = [];
  $('#genres-list input:checked').each(function() {
    genres.push($(this).val());
  });
  let genresString = genres.join();
  localStorage.setItem('currentGenres', genresString);
  $('#current-genres').text(genresString);

  // Get slider values
  let audioFeatures = getSliderValues();
  localStorage.setItem('currentFeatures', JSON.stringify(audioFeatures));

  // Send the request
  $.get(
    '/recommendations?seed_genres=' +
      genresString +
      '&' +
      $.param(audioFeatures) +
      '&token=' +
      _token,
    function(data) {
      $('#tracks').empty();
      let trackIds = [];
      let trackUris = [];
      if (data.tracks) {
        if (data.tracks.length > 0) {
          data.tracks.forEach(function(track) {
            trackIds.push(track.id);
            trackUris.push(track.uri);
          });
          localStorage.setItem('currentTracks', trackUris.join());
          console.log(trackIds);
        } else {
          console.log('Try more broad parameters');
        }
      } else {
        console.log('Please pick some genres');
      }
    }
  );
}

function makePlaylist() {
  if (localStorage.getItem('currentTracks')) {
    $.post(
      '/playlist?tracks=' +
        localStorage.getItem('currentTracks') +
        '&genres=' +
        localStorage.getItem('currentGenres') +
        '&features=' +
        localStorage.getItem('currentFeatures') +
        '&token=' +
        _token
    );
    alert("Success! Check Spotify for you playlist!")
  } else if (!localStorage.getItem('currentTracks')) {
    console.log('No tracks :/');
  }
  clearLocals();
}

// User creates new playlist upon login
// function newPlaylist() {
//
//   //$.post('/newPlaylist?playlistName=TESTING&token=' + _token);
// }


// User adds to recently created playlist, will need to store the playlist id
// function addToPlaylist() {
//
//
// }

function clearLocals() {
  localStorage.setItem('currentTracks', '');
  localStorage.setItem('currentGenres', '');
  localStorage.setItem('currentFeatures', '');
}
