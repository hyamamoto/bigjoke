// options.js

var defaultFavWord = chrome.i18n.getMessage("defaultFavWord");
var defaultLovWord = chrome.i18n.getMessage("defaultLovWord");

function loadOptions() {

  var favWord = localStorage["favWord"];
  if (favWord == undefined || (favWord == "")) {
    favWord = defaultFavWord;
  }

  var lovWord = localStorage["lovWord"];
  if (lovWord == undefined || (lovWord == "")) {
    lovWord = defaultLovWord;
  }

  var inputFavWord = document.getElementById("favWord");
  inputFavWord.value = favWord;
  
  var selectLovWord = document.getElementById("lovWord");
  var lovWord0 = chrome.i18n.getMessage("lovWord0");
  if (lovWord0 !== undefined && (lovWord0 != "")) {
      var option = document.createElement("option");
      option.setAttribute("value",lovWord0);
      option.appendChild(document.createTextNode(lovWord0));
      selectLovWord.appendChild(option);
  }
  for (var i = 0; i < selectLovWord.children.length; i++) {
    var child = selectLovWord.children[i];
    if (child.value == lovWord) {
      child.selected = "true";
      break;
    }
  }
}

function saveOptions() {
  var input = document.getElementById("favWord");
  var favWord = input.value;
  localStorage["favWord"] = favWord;
  
  var select = document.getElementById("lovWord");
  var lovWord = select.children[select.selectedIndex].value;
  localStorage["lovWord"] = lovWord;

  var alertSuccess = document.getElementById("saveSuccess");
  alertSuccess.style.display = "block";

  setTimeout( function() { location.reload(); }, 400);
}

function eraseOptions() {
  localStorage.removeItem("favWord");
  localStorage.removeItem("lovWord");
  location.reload();
}

window.onload = function () {
  loadOptions();
  document.querySelector('button[value="saveOptions"]').onclick = saveOptions;
  document.querySelector('button[value="eraseOptions"]').onclick = eraseOptions;
}