(function() {
  var searchBox = {};
  var SEARCH_LIMIT = 200;
  var satData;

  var hovering = false;
  var hoverSatId = -1;

  var resultsOpen = false;
  var lastResultGroup;

  searchBox.isResultBoxOpen = function() {
    return resultsOpen;
  };

  searchBox.getLastResultGroup = function() {
    return lastResultGroup;
  };

  searchBox.setLastResultGroup = function(lrg) {
    lastResultGroup = lrg;
  };

  searchBox.getCurrentSearch = function() {
    if(resultsOpen) {
      return $('#search').val();
    } else {
      return null;
    }
  };

  searchBox.clearSearchBox = function() {
    $('#search').val('');
    updateUrl();
  }

  searchBox.isHovering = function() {
    return hovering;
  };

  searchBox.getHoverSat = function() {
    return hoverSatId;
  };
  
  searchBox.hideResults = function() {
    var sr = $('#search-results');
    sr.slideUp();
    groups.clearSelect();
    resultsOpen = false;
    searchBox.clearSearchBox();
  };

  searchBox.doSearch = function(str) {
    selectSat(-1);

    $('#search').val(str);  // in case the search was not fired by user input

    if(str.length === 0) {
      searchBox.hideResults();
      lastResultGroup = null;
      updateUrl();
      return;
    }

    var searchStart = performance.now();

    str = str.toUpperCase();

    var results = [];
    for(var i=0; i < satData.length; i++) {
      if(satData[i].OBJECT_NAME.indexOf(str) !== -1) {
        results.push({
          isIntlDes : false, 
          strIndex : satData[i].OBJECT_NAME.indexOf(str),
          satId : i
        });
      }
      
      if(satData[i].intlDes.indexOf(str) !== -1) {
        results.push({
          isIntlDes : true, 
          strIndex : satData[i].intlDes.indexOf(str),
          satId : i
        });
      }
      
    }
    var resultCount = results.length;

    if(results.length > SEARCH_LIMIT) {
      results.length = SEARCH_LIMIT;
    }

    //make a group to hilight results
    var idList = [];
    for(var i=0; i<results.length; i++) {
      idList.push(results[i].satId);
    }
    var dispGroup = new groups.SatGroup('idList', idList);
    lastResultGroup = dispGroup;
    groups.selectGroup(dispGroup);
    groups.clearSelectMenu();

    searchBox.fillResultBox(results, str);
    updateUrl();
  };

  searchBox.fillResultBox = function (results, searchStr) {
    // results:
    // [ 
    //   { sat: { id: <id>, } }
    // ]

    var resultBox = $('#search-results');
    var html = '';
    for(var i=0; i < results.length; i++) {
      var sat = satData[results[i].satId];
      html += '<div class="search-result" data-sat-id="' + sat.id + '">';
      if(results[i].isIntlDes) {
        html += sat.OBJECT_NAME;
      } else {
        html += sat.OBJECT_NAME.substring(0, results[i].strIndex);
        html += '<span class="search-hilight">';
        html += sat.OBJECT_NAME.substring(results[i].strIndex, results[i].strIndex + searchStr.length);
        html += '</span>';
        html += sat.OBJECT_NAME.substring(results[i].strIndex + searchStr.length);
      }
      html += '<div class="search-result-intldes">';
      if(results[i].isIntlDes) {
        html += sat.intlDes.substring(0, results[i].strIndex);
        html += '<span class="search-hilight">';
        html += sat.intlDes.substring(results[i].strIndex, results[i].strIndex + searchStr.length);
        html += '</span>';
        html += sat.intlDes.substring(results[i].strIndex + searchStr.length);
      } else {
        html += sat.intlDes;
      }
      html += '</div></div>';
    }
            var resultStart = performance.now();
    //  resultBox.append(html);
    resultBox[0].innerHTML = html;
    resultBox.slideDown();
    resultsOpen = true;
  };
  
  searchBox.init = function(_satData) {
    satData = _satData;
    $('#search-results').on('click', '.search-result', function(evt) {
      var satId = $(this).data('sat-id');
      selectSat(satId);
     // hideResults();
    });

    $('#search-results').on('mouseover', '.search-result', function(evt) {
      if ("maxTouchPoints" in navigator && navigator.maxTouchPoints > 0) {
        $(this).click();
        return false;
      }
      var satId = $(this).data('sat-id');
      orbitDisplay.setHoverOrbit(satId);
      satSet.setHover(satId);

      hovering = true;
      hoverSatId = satId;
    });

   $('#search-results').mouseout(function() {
      orbitDisplay.clearHoverOrbit();
      satSet.setHover(-1);
  //    hoverBoxOnSat(-1);
      hovering = false;
    }); 
    
    $('#search').on('input', function() {
        var initStart = performance.now();
        var searchStr = $('#search').val()

        searchBox.doSearch(searchStr);
    });

    $('#all-objects-link').click(function(ev) {
      if (selectedSat === -1) {
        console.log('GREG: saw a selectedSat of -1, so I must ignore this click');
        return;
      }
      var intldes = satSet.getSat(selectedSat).intlDes;
      var searchStr = intldes.slice(0,8);
      var saved_selectedSat = selectedSat;
      searchBox.doSearch(searchStr); // clears selectedSat and fades out infobox, which we really don't want
      selectSat(saved_selectedSat);
      // currently this click seems to always happen twice in a row?
      // you can see the infobox fade out and appear twice
      ev.stopPropagation(); // does not help
    });
  };
  
  
  
  window.searchBox = searchBox;
})();
