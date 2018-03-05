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
const redirectUri = 'http://mymixtape.herokuapp.com';
// const redirectUri = 'http://localhost:5000';
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
console.log(_token);

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
    genres.forEach(function(genre) {
      let genreButtonElement =
        '<label class="button"><input type="checkbox" value="' +
        genre +
        '">' +
        genre +
        '</label>';
      $('#genres-list').append(genreButtonElement);
    });
  });
}

function makePlaylist() {
  $.post('/playlist?&token=' + _token);
}
