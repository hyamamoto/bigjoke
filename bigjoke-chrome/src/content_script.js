// content_script.js

// Langs to func dictionary
// For lang tags, Check ( http://www.w3.org/International/articles/language-tags/ )
var map_lang_func = {
  en: {
    names: ["en", "en_US"],
    func: text_en
  },
  ja: {
    names: ["ja"],
    func: text_ja
  },
  de: {
    names: ["de", "de_CH"],
    func: text_de
  },
  zh: {
    names: ["zh", "zh_CN", "zh_HK", "zh_SG", "zh_TW"],
    func: text_zh
  },
  und: {
    names: [],
    func: text_en
  }
};

function textCustomFunc(wordPair) {
  console.log("word: " + wordPair);
  var re = new RegExp(wordPair[0], "g");
  return function textCustom(textNode) {
    var v = textNode.nodeValue;
    v = v.replace(re, wordPair[1]);
    textNode.nodeValue = v;
  };
}

// en: English
function text_en(textNode) {
  var v = textNode.nodeValue;
  v = v.replace(/\bThe cloud\b/g, "My butt");
  v = v.replace(/\bthe cloud\b/g, "my butt");
  v = v.replace(/\b[Bb]ig ?[Dd]ata\b/g, "My butt");
  textNode.nodeValue = v;
}


// en: German
function text_de(textNode) {
  var v = textNode.nodeValue;
  v = v.replace(/\b[Dd]atenwolke\b/g, "my butt");
  textNode.nodeValue = v;
}

// ja: Japanese
function text_ja(textNode) {
  var v = textNode.nodeValue;
  v = v.replace(/クラウド/g, "俺のケツ");
  v = v.replace(/ビッ[グク]・?データ/g, "俺のケツ");
  textNode.nodeValue = v;
}

// zh: Chinese
function text_zh(textNode) {
  var v = textNode.nodeValue;
  v = v.replace(/大[数數][据據]/g, "我的屁股");
  v = v.replace(/巨量資料/g, "我的屁股");
  textNode.nodeValue = v;
}

function toTextFunc(lang) {
  for (id in map_lang_func) {
    var func;
    var val = map_lang_func[id];
    val["names"].forEach(function (name) {
      if (lang == name) {
        func = val["func"];
      }
    });
    if (func !== undefined) {
      return func;
    }
  }
  return undefined;
}

function toTextFuncs(languages) {
  var textFuncs = [];
  languages.forEach(function (lang) {
    var langTextFunc = toTextFunc(lang);
    if (langTextFunc === undefined) {
      return; // undef.
    }
    for (textFunc in textFuncs) {
      if (langTextFunc === textFunc) {
        return; // dupe
      }
    }
    textFuncs.push(langTextFunc);
  });
  return textFuncs;
}

// Escaping for RegExp (unused for now)
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// Data from background: userWordPair: [favWord, lovWord]
function retrieveUserWord(callback) {
  chrome.extension.sendRequest({
    action: 'userWordPair'
  }, function (response) {
    var word = response;
    callback(word);
  });
}

// Data from background: userLangs: [lang...]
function retrieveUserLangs(callback) {
  chrome.extension.sendRequest({
    action: 'userLangs'
  }, function (response) {
    var langs = response;
    callback(langs);
  });
}

// Walk the DOM tree.
function walk(node, funcs) {
  // I stole this function from here: http://is.gd/mwZp7E
  var child, next;
  switch (node.nodeType) {
    case 1:
      // Element
    case 9:
      // Document
    case 11:
      // Document fragment
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child, funcs);
        child = next;
      }
      break;
    case 3:
      // Text node
      funcs.forEach(
        function (func) {
          func(node);
        });
      break;
  }
}

// Main
retrieveUserWord(function (wordPair) {
  // console.log("userWordPair: " + wordPair);
  retrieveUserLangs(function (langs) {
    var textFuncs = toTextFuncs(langs); // NOTE: navigator.language?
    if (textFuncs === undefined || textFuncs.length == 0) {
      textFuncs = [text_en];
    }
    if (wordPair !== undefined && wordPair.length >= 2) {
      textFuncs.push( textCustomFunc(wordPair));
    }
    // console.log("walking for " + langs + ", " + textFuncs);
    walk(document.body, textFuncs);
  });
});