
if ( console !== undefined ) {
  window.console = {
    log: function() {
      var console = chrome.extension.getBackgroundPage().console;
      console.log.apply(console, arguments);
    }
  }
}

// chrome-extension://nlgcapbidnaegcmbibkofnbcibdlpnfg/popup.html

document.addEventListener('DOMContentLoaded', function () {
  console.log('lets get started');

  var github = new OAuth2('github', {
    client_id: '09450dfdc3ae76768b08',
    client_secret: '8ecfc23e0dba1ce1a295fbabc01fa71db4b80261'
  }, function() {
    console.log('start auth', github.hasAccessToken())
    github.authorize(function() {
      var access_token = github.getAccessToken();
      console.log( 'complete2', access_token )

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function(event) {
        if (xhr.readyState == 4) {
          if(xhr.status == 200) {
            console.log(xhr.responseText);
          }
        }
      }

      xhr.open('GET', 'https://api.github.com/users/ragingwind/gists?access_token=' + access_token, true);
      xhr.send();
    });
  });

});
