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
$('#genres-list').empty();

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
        $('#genres-list')
          .append(genreButtonElement)
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
  $('#popularity-slider').slider(sliderConfig);
  $('#positivity-slider').slider(sliderConfig);
  $('#energy-slider').slider(sliderConfig);
  $('#acousticness-slider').slider(sliderConfig);
  $('#danceability-slider').slider(sliderConfig);
  $('#instrumentalness-slider').slider(sliderConfig);
  $('#liveness-slider').slider(sliderConfig);
  $('#speechiness-slider').slider(sliderConfig);
}

function getSliderValues() {
  let values = {};

  let popularity_value = $('#popularity-slider').slider('values', 0);
  let positivity_value = $('#positivity-slider').slider('values', 0);
  let energy_value = $('#energy-slider').slider('values', 0);
  let acousticness_value = $('#acousticness-slider').slider('values', 0);
  let danceability_value = $('#danceability-slider').slider('values', 0);
  let instrumentalness_value = $('#instrumentalness-slider').slider(
    'values',
    0
  );
  let liveness_value = $('#liveness-slider').slider('values', 0);
  let speechiness_value = $('#speechiness-slider').slider('values', 0);

  values['popularity_value'] = popularity_value;
  values['positivity_value'] = positivity_value;
  values['energy_value'] = energy_value;
  values['acousticness_value'] = acousticness_value;
  values['danceability_value'] = danceability_value;
  values['instrumentalness_value'] = instrumentalness_value;
  values['liveness_value'] = liveness_value;
  values['speechiness_value'] = speechiness_value;

  return values;
}

function getValues() {
  let values = getSliderValues();
  localStorage.setItem('currentValues', JSON.stringify(values));
  alert(localStorage.currentValues);
}
function getRecommendations() {
  console.log('gonna get you some recommendations');
}

function makePlaylist() {
  $.post('/playlist?&token=' + _token);
}
