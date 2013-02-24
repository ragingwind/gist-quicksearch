(function() {
  'use strict';

  var xhr = function() {
    var xhr = new XMLHttpRequest();
    return function( method, url, callback ) {
      xhr.onreadystatechange = function() {
        if ( xhr.readyState === 4 ) {
          callback( xhr.status, xhr.responseText, xhr.statusText );
        }
      };
      xhr.open( method, url );
      xhr.send();
    };
  }();

  var parseGists = function() {
    var addressExp = /<a href="([^>]*)">/ig;
    var titleExp = /<span class="search-result-title">([^>]*)<\/span>/ig;

    return function( res ) {
      var matches, itr = 0;
      var items = [];

      // get address from results
      while (matches = addressExp.exec( res )) {
        items.push({ address: matches[1], title: '' });
      }

      // get title from results
      while (matches = titleExp.exec( res )) {
        items[itr++].title = matches[1];
      }

      return items;
    };
  }();

  window.gistQuickSearch = function( query, done ) {
    xhr( 'GET', 'https://gist.github.com/search/quick?q=' + query, function( status, res, statusText ) {
      var items = ( status == 200 ) ? parseGists( res ) : [{ address: '/error/' + status, title: statusText }];
      done( items );
    });
  }

})();