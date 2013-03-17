// background.js

var defaultFavWord = chrome.i18n.getMessage("defaultFavWord");
var defaultLovWord = chrome.i18n.getMessage("defaultLovWord");

function loadUserWordPair() {
  var favWord = localStorage["favWord"];
  var lovWord = localStorage["lovWord"];
  if (!favWord) {
    favWord = defaultFavWord;
  }
  if (!lovWord) {
    lovWord = defaultLovWord;
  }
  return [favWord, lovWord];
}

// Register a message responder.
chrome.extension.onRequest.addListener(
function (request, sender, sendResponse) {
  switch (request.action) {
    case 'userLangs':
      chrome.i18n.getAcceptLanguages(
      function (langs) {
        sendResponse(langs);
      });
      break;
    case 'userWordPair':
      var userWordPair = loadUserWordPair();
      console.log(loadUserWordPair());
      sendResponse(userWordPair);
      break;
  }
});