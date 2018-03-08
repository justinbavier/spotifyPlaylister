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
  const sliderConfig = {
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0,
    stop: function() {
      getRecommendations();
    }
  };

  $('#positivity-slider').slider(sliderConfig);
  $('#energy-slider').slider(sliderConfig);
  $('#acousticness-slider').slider(sliderConfig);
  $('#danceability-slider').slider(sliderConfig);
  $('#instrumentalness-slider').slider(sliderConfig);
  $('#liveness-slider').slider(sliderConfig);
  $('#speechiness-slider').slider(sliderConfig);

  $('#popularity-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 100,
    step: 1,
    value: 0,
    stop: function() {
      getRecommendations()
    }
  });
}

function getSliderValues() {
  let values = {};

  let min_popularity = $('#popularity-slider').slider('values', 0);
  let min_positivity = $('#positivity-slider').slider('values', 0);
  let min_energy = $('#energy-slider').slider('values', 0);
  let min_acousticness = $('#acousticness-slider').slider('values', 0);
  let min_danceability = $('#danceability-slider').slider('values', 0);
  let min_instrumentalness = $('#instrumentalness-slider').slider(
    'values',
    0
  );
  let min_liveness = $('#liveness-slider').slider('values', 0);
  let min_speechiness = $('#speechiness-slider').slider('values', 0);

  values['min_popularity'] = min_popularity;
  values['min_positivity'] = min_positivity;
  values['min_energy'] = min_energy;
  values['min_acousticness'] = min_acousticness;
  values['min_danceability'] = min_danceability;
  values['min_instrumentalness'] = min_instrumentalness;
  values['min_liveness'] = min_liveness;
  values['min_speechiness'] = min_speechiness;

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
    alert(
      '/playlist?tracks=' +
        localStorage.getItem('currentTracks') +
        '&genres=' +
        localStorage.getItem('currentGenres') +
        '&features=' +
        localStorage.getItem('currentFeatures') +
        '&token=' +
        _token
    );
  } else if (!localStorage.getItem('currentTracks')) {
    console.log('No tracks :/');
  }
  clearLocals();
}

function addToPlaylist() {}

function clearLocals() {
  localStorage.setItem('currentTracks', '');
  localStorage.setItem('currentGenres', '');
  localStorage.setItem('currentFeatures', '');
  alert(localStorage.getItem('currentGenres'));
}
