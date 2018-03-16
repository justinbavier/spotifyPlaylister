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
const redirectUri = 'http://crosshair-playlist.herokuapp.com';
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
// showUser();
setUpSliders();
setUpMode();

$(function() {
  $('[data-toggle="popover"]').popover();
});

// Button Functions
// $('#logout-button').click(function() {
//   logout();
//   return false;
// });

// $('#submit-button').click(function() {
//   newPlaylist();
//   return false;
// });

// $('#tracks-button').click(function() {
//   addTracks();
//   return false;
// });

$('#clear-button').click(function() {
  clearCache();
  location.reload();
  return false;
});

// function showUser() {
//   $.get('/user?token=' + _token, function(user) {
//     $('#current-user').text(user.id);
//     $('#display-name').text(user.display_name);
//   });
// }

// Need to make this a more streamlined process
// Currently opens logout page in new tab
// Logout only truly happens upon manual refresh
// function logout() {
//   _token = null;
//   window.open('https://accounts.spotify.com/logout');
//   location.reload();
// }

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

function setUpMode() {
  $('#mode-value').text('Minor');
}

function setUpSliders() {
  $('#positivity-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.5,
    stop: function() {
      getRecommendations();
    },
    create: function() {
      $('#positivity-value').text($('#positivity-slider').slider('values', 0));
    },
    slide: function() {
      $('#positivity-value').text($('#positivity-slider').slider('values', 0));
    }
  });
  $('#energy-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.3,
    stop: function() {
      getRecommendations();
    },
    create: function() {
      $('#energy-value').text($('#energy-slider').slider('values', 0));
    },
    slide: function() {
      $('#energy-value').text($('#energy-slider').slider('values', 0));
    }
  });
  $('#acousticness-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.65,
    stop: function() {
      getRecommendations();
    },
    create: function() {
      $('#acousticness-value').text(
        $('#acousticness-slider').slider('values', 0)
      );
    },
    slide: function() {
      $('#acousticness-value').text(
        $('#acousticness-slider').slider('values', 0)
      );
    }
  });
  $('#danceability-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.55,
    stop: function() {
      getRecommendations();
    },
    create: function() {
      $('#danceability-value').text(
        $('#danceability-slider').slider('values', 0)
      );
    },
    slide: function() {
      $('#danceability-value').text(
        $('#danceability-slider').slider('values', 0)
      );
    }
  });
  $('#instrumentalness-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.4,
    stop: function() {
      getRecommendations();
    },
    create: function() {
      $('#instrumentalness-value').text(
        $('#instrumentalness-slider').slider('values', 0)
      );
    },
    slide: function() {
      $('#instrumentalness-value').text(
        $('#instrumentalness-slider').slider('values', 0)
      );
    }
  });
  $('#liveness-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.6,
    stop: function() {
      getRecommendations();
    },
    create: function() {
      $('#liveness-value').text($('#liveness-slider').slider('values', 0));
    },
    slide: function() {
      $('#liveness-value').text($('#liveness-slider').slider('values', 0));
    }
  });
  $('#speechiness-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 1,
    step: 0.01,
    value: 0.5,
    stop: function() {
      getRecommendations();
    },
    create: function() {
      $('#speechiness-value').text(
        $('#speechiness-slider').slider('values', 0)
      );
    },
    slide: function() {
      $('#speechiness-value').text(
        $('#speechiness-slider').slider('values', 0)
      );
    }
  });

  $('#tempo-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 200,
    step: 1,
    value: 120,
    stop: function() {
      getRecommendations();
    },
    create: function() {
      $('#tempo-value').text($('#tempo-slider').slider('values', 0));
    },
    slide: function() {
      $('#tempo-value').text($('#tempo-slider').slider('values', 0));
    }
  });

  $('#popularity-slider').slider({
    orientation: 'vertical',
    min: 0,
    max: 100,
    step: 1,
    value: 40,
    stop: function() {
      getRecommendations();
    },
    create: function() {
      $('#popularity-value').text($('#popularity-slider').slider('values', 0));
    },
    slide: function() {
      $('#popularity-value').text($('#popularity-slider').slider('values', 0));
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
  let target_tempo = $('#tempo-slider').slider('values', 0);

  if ($('#mode-value').is(':checked')) {
    values['target_mode'] = 0;
    $('#mode-text').text('Minor');
  } else if ($('#mode-value').is(':not(:checked)')) {
    values['target_mode'] = 1;
    $('#mode-text').text('Major');
  }

  values['target_popularity'] = target_popularity;
  values['target_positivity'] = target_positivity;
  values['target_energy'] = target_energy;
  values['target_acousticness'] = target_acousticness;
  values['target_danceability'] = target_danceability;
  values['target_instrumentalness'] = target_instrumentalness;
  values['target_liveness'] = target_liveness;
  values['target_speechiness'] = target_speechiness;
  values['target_tempo'] = target_tempo;

  console.log(values);
  return values;
}

function getRecommendations() {
  // Get selected genres
  let genres = [];
  $('#genres-list input:checked').each(function() {
    genres.push($(this).val());
  });
  if (genres[0]) {
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
            renderTracks(trackIds);
          } else {
            alert('Try more broad parameters');
          }
        } else {
          alert('Please pick at least 1 genre!');
        }
      }
    );
  } else if (!genres[0]) {
    alert(
      `Spotify's recommendation API requires that you pick a genre to send requests!`
    );
  }
}

// function makePlaylist() {
//   if (localStorage.getItem('currentTracks')) {
//     $.post(
//       '/playlist?tracks=' +
//         localStorage.getItem('currentTracks') +
//         '&genres=' +
//         localStorage.getItem('currentGenres') +
//         '&features=' +
//         localStorage.getItem('currentFeatures') +
//         '&token=' +
//         _token
//     );
//     alert('Success! Check Spotify for you playlist!');
//   } else if (!localStorage.getItem('currentTracks')) {
//     console.log('No tracks :/');
//   }
//   clearLocals();
// }

function renderTracks(ids) {
  $.get('/tracks?ids=' + ids.join() + '&token=' + _token, function(tracks) {
    tracks.forEach(function(track) {
      let image = track.album.images
        ? track.album.images[0].url
        : 'https://upload.wikimedia.org/wikipedia/commons/3/3c/No-album-art.png';
      let trackElement =
        '<div class="track-element col-md-4" id="' +
        track.uri +
        '" onclick="play(\'' +
        track.uri +
        '\');"><div><div class="row"><img class="album-art" src="' +
        image +
        '"/></div><div class="row"><a class="track-name" href="https://open.spotify.com/track/' +
        track.id +
        '" target="_blank"><p class="text-center">' +
        track.name +
        '</p></a><p class="artist-name text-center">' +
        track.artists[0].name +
        '</p></div></div></div>';
      $('#tracks').append(trackElement);
    });
  });
}

function updatePlaylist() {
  let latestPlaylist = '<iframe class="spotify-player col-md-6" src="https://open.spotify.com/embed/user/bavier123/playlist/3lQ94EvUZ5eockX8VJ1Zom" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>'
  $('#spotify-player').append(latestPlaylist);
}

function addTracks() {
  if (localStorage.getItem('currentTracks')) {
    $.post(
      '/addTracks?tracks=' +
        localStorage.getItem('currentTracks') +
        '&token=' +
        _token
    );
    updatePlaylist();
    clearLocals();
  } else if (!localStorage.getItem('currentTracks')) {
    alert(`There's no tracks to add! Pick a genre...`);
  } else if (!localStorage.getItem('currentPlaylist')) {
    alert(
      `You can't add tracks to a playlist you haven't created yet! Click the button...`
    );
  }
}

//User creates new playlist upon login
function newPlaylist() {
  let playlistName = document.getElementById('playlist-name').value;
  let playlistDescription = document.getElementById('playlist-description')
    .value;
  if (!playlistName) {
    alert('Please give you playlist a name!');
  } else if (playlistName) {
    $.post(
      '/newPlaylist?playlistName=' +
        playlistName +
        '&playlistDescription=' +
        playlistDescription +
        '&token=' +
        _token,
      function(playlist) {
        localStorage.setItem('currentPlaylist', playlist.href);
        localStorage.setItem('playlistName', playlist.name);
        alert(
          'Playlist ' +
            localStorage.getItem('playlistName') +
            ' successfully created!'
        );
      }
    );
  }
}

function submitEmail() {
  let email = document.getElementById('email').value;
  let FNAME = document.getElementById('FNAME').value;
  let LNAME = document.getElementById('LNAME').value;
  $.post('/email?email=' +
  email +
  '&FNAME=' +
  FNAME +
  '&LNAME=' +
  LNAME,
  function() {
    console.log('success');
  });
  location.reload();
}


function clearCache() {
  localStorage.setItem('currentTracks', '');
  localStorage.setItem('currentGenres', '');
  localStorage.setItem('currentFeatures', '');
  localStorage.setItem('currentPlaylist', '');
  _token = null;
}

function clearLocals() {
  localStorage.setItem('currentTracks', '');
  localStorage.setItem('currentGenres', '');
  localStorage.setItem('currentFeatures', '');
}
