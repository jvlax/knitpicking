setThumbnail();
setPatterns();
/*
waitForImageToLoad(document.getElementById('thumbnail')).then(() => {
  document.getElementById('load').style.display = "none";
  document.getElementById('main').style.display = "block";
});
*/
function setThumbnail() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    var url = tabs[0].url;
    console.log(url);
    getImage(url);
    //chrome.tabs.update(tabs[0].id, {url: newUrl});
    //console.log(tabs[0].url);
  });
}

function getImage(url) {
  console.log("got url " + url);
  //var id = url.href.substr(url.href.lastIndexOf('/') + 1) + ".json";
  var id = url.split("/").pop() + ".json";
  console.log("id " + id);
  var ravelryURL = 'https://api.ravelry.com/patterns/' + id;
  var USERNAME = 'read-dfd3c5a6f1b53000627d912834e6f6f3';
  var PASSWORD = 'wh1FB3MH6KrW47O6XUd/V5BmIRL7Lg5VMRnWuAWU';

  $.ajax({
    type: "GET",
    url: ravelryURL,
    dataType: 'json',
    headers: {
      "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
    },
    success: function(response) {
      //console.log(response.pattern.photos[0].medium_url);

      //console.log(response.pattern.photos[0].thumbnail_url);
      //id = response.pattern.id;
      document.getElementById("patternId").value = response.pattern.id;
      console.log("set id to " + response.pattern.id);
      //document.getElementById('thumbnail').src = response.pattern.photos[0].medium_url;
      //return response.pattern.photos[0].thumbnail_url;
    }
  });
}
let addPattern = document.getElementById('addPattern');
addPattern.onclick = function() {
  chrome.storage.sync.get("patterns", function(items) {
    if (!chrome.runtime.error) {
      console.log("read patterns " + items.patterns);
      //console.log(items.patterns);
      //document.getElementById("patternId").value = document.getElementById("patternId").value + "," + items.patterns;
      //console.log("setting element to " + document.getElementById("patternId").value);
      //console.log("reading patterns " + items.patterns);
      if (typeof items.patterns == 'undefined' || !items.patterns.match(document.getElementById("patternId").value)) {
        chrome.storage.sync.set({
          "patterns": document.getElementById("patternId").value + "," + items.patterns,

        }, function() {
          console.log('Value is set to ' + document.getElementById("patternId").value);
          //patternString = "";
        });
      }
    }
  });
  window.close();
  //console.log("id " + document.getElementById("patternId").value);
};
let clearPatterns = document.getElementById('clearPatterns');
clearPatterns.onclick = function() {
  chrome.storage.sync.remove("patterns");
  document.getElementById("patternId").value = "";
  setPatterns();
  setThumbnail();
}
let pickPatterns = document.getElementById('pickPatterns');
pickPatterns.onclick = function() {
  console.log("redirect");
  chrome.storage.sync.get("patterns", function(items) {
    if (!chrome.runtime.error) {
      var patterns = items.patterns;
      items.patterns = items.patterns.replace(/,undefined/g, '');
      console.log('http://valter-lax.com/knitpicking?patterns=' + items.patterns);
      window.open('http://valter-lax.com/knitpicking?patterns=' + items.patterns, '_blank');
    }
  });
}

function setPatterns() {
  chrome.storage.sync.get("patterns", function(items) {
    if (!chrome.runtime.error) {
      console.log(items.patterns + " in inventory");
      if (typeof items.patterns === 'undefined') {
        var nPatterns = "0";
      } else {
        var nPatterns = (items.patterns.match(/,/g) || []).length;
      }
      document.getElementById('ribbon').innerHTML = nPatterns;
    }
  });
}

function waitForImageToLoad(imageElement) {
  return new Promise(resolve => {
    imageElement.onload = resolve
  })
}
