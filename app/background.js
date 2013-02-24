
chrome.runtime.onInstalled.addListener(function( details ) {
	console.log('previousVersion', details.previousVersion);
});

chrome.omnibox.setDefaultSuggestion({
  description: '<url><match>more gist:</match></url> Search Gist on Github.com'
});

chrome.omnibox.onInputEntered.addListener(function( text ) {
  var gisturi = text.indexOf( 'gist://' ) >= 0;
  var url = 'https://gist.github.com/';
  url += ( gisturi ? text.substring(7) : 'search/quick?q=' + text );

  chrome.tabs.getSelected( null, function( tab ) {
    chrome.tabs.update( tab.id, { url: url });
  });
});

chrome.omnibox.onInputChanged.addListener(function( text, suggest ) {
  // prevent to request null query or text of started 'gist://'
  if ( text.length == 0 || text.indexOf( 'gist://' ) >= 0 ) {
    return;
  }

  gistQuickSearch(text, function( items ) {
    var results = [];

    for (var i = 0, max = items.length; i < max; ++i ) {
      var author = '<url><match>' + items[i].address.match(/\/(.*)\//)[1] + '</match></url>: ';
      var title = items[i].title.replace(text, '<match>' + text + '</match>');
      results.push({ content: 'gist:/' + items[i].address, description: author + title });
    };

    if ( results.length > 0 ) {
      suggest( results );
    }
  });

});

