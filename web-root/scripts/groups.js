/* global $ */
/* global ColorScheme */
/* global orbitDisplay */
/* global satSet */
(function() {
	var groups = {};
	groups.selectedGroup = null;
	
	function SatGroup(groupType, data) {
		this.sats = [];
    if(groupType === 'intlDes') {
      for(var i=0; i < data.length; i++){
        this.sats.push({
          satId : satSet.getIdFromIntlDes(data[i]),
          isIntlDes : true,
          strIndex : 0,
        });
      }
    } else if (groupType === 'nameRegex') {
      var satIdList = satSet.searchNameRegex(data);
      for(var i=0; i < satIdList.length; i++) {
        this.sats.push({
          satId : satIdList[i],
          isIntlDes : false,
          strIndex : 0,
        });
      } 
    } else if (groupType === 'idList') {
      for(var i=0; i < data.length; i++) {
        this.sats.push({
          satId : data[i],
          isIntlDes : false,
          strIndex : 0
        });
      } 
    }
	}
	
	SatGroup.prototype.hasSat = function(id) {
		var len = this.sats.length;
		for(var i=0; i < len; i++) {
			if(this.sats[i].satId === id) return true;
		}
		return false;
	};
  
  SatGroup.prototype.updateOrbits = function() {
    for(var i=0; i < this.sats.length; i++) {
      orbitDisplay.updateOrbitBuffer(this.sats[i].satId);
    }
  };
  
  SatGroup.prototype.forEach = function(callback) {
    for(var i=0; i<this.sats.length; i++) {
      callback(this.sats[i].satId);
    }
  };

  SatGroup.prototype.count = function() {
    return this.sats.length;
  };


  groups.SatGroup = SatGroup;
  
  groups.selectGroup = function(group) {
    var start = performance.now();
		groups.selectedGroup = group;
    group.updateOrbits();
    satSet.setColorScheme(ColorScheme.group);
    var t = performance.now() - start;
   // console.log('selectGroup: ' + t + ' ms');
	};
  
  groups.clearSelect = function() {
    groups.selectedGroup = null;
    satSet.setColorScheme(ColorScheme.default);
  };
	
	groups.init = function() {
    var start = performance.now();
    
    var clicked = false;
    $('#groups-display').mouseout(function() {
      if(!clicked) {
        if(searchBox.isResultBoxOpen()) {
          groups.selectGroup(searchBox.getLastResultGroup());
        } else {
          groups.clearSelect();
        }
      }
    });
    
		$('#groups-display>li').mouseover(function() {

      var groupName = $(this).data('group');
      if ("maxTouchPoints" in navigator && navigator.maxTouchPoints > 0) { // recommended by Mozilla
        // note Microsfoft calls this msMaxTouchPoints for Win 8/IE 10.
	if (groupName != '<divider>') {
          // treat touch mouseover as a click, fixing double click problem
          $(this).click();
	  // XXX stop propagation? e.stopImmediatePropagation();
          return false;
        }
      }

      clicked = false;
      var groupName = $(this).data('group');
      if(groupName === '<divider>') {
        ;
      } else if(groupName === '<clear>') {
        ;
      } else {
       // put length of group into the text
       var mouseover_innerHTML = this.innerHTML;
       if (! mouseover_innerHTML.endsWith(')')) {
         var group_length = groups[groupName].count();
	 console.log(groupName, 'length', group_length.toString())
         this.innerHTML = mouseover_innerHTML + ' (' + group_length + ')';
       }
       groups.selectGroup(groups[groupName]);
      }
		});
    
    $('#groups-display>li').click(function() {
      clicked = true;
      var groupName = $(this).data('group');
      if(groupName === '<divider>') {
        clicked = false;
      } else if(groupName === '<clear>') {
        groups.clearSelect();
        $('#menu-groups .menu-title').text('Groups');
        $(this).css('display', 'none');
      } else {
        selectSat(-1); //clear selected sat
        groups.selectGroup(groups[groupName]);

        searchBox.fillResultBox(groups[groupName].sats, '');

        $('#menu-groups .clear-option').css({
          display: 'block'
        });
        $('#menu-groups .menu-title').text('Groups (' + $(this).text() + ')');
      }
      
      $('#groups-display').css({
        display: 'none'
      });
    });
	
	  groups.GPSGroup = new SatGroup('intlDes', [
  		'90103A',
      '93068A',
      '96041A',
      '97035A',
      '99055A',
      '00025A',
      '00040A',
      '00071A',
      '01004A',
      '03005A',
      '03010A',
      '03058A',
      '04009A',
      '04023A',
      '04045A',
      '05038A',
      '06042A',
      '06052A',
      '07047A',
      '07062A',
      '08012A',
      '09043A',
      '10022A',
      '11036A',
      '12053A',
      '13023A',
      '14008A',
      '14026A',
      '14045A',
      '14068A',
      '15013A'
    ]);   
    groups.IridiumGroup = new SatGroup('nameRegex', /IRIDIUM(?!.*DEB)/);
    groups.Iridium33DebrisGroup = new SatGroup('nameRegex', /(COSMOS 2251|IRIDIUM 33) DEB/);
    groups.GlonassGroup = new SatGroup('nameRegex', /GLONASS/);
    groups.GalileoGroup = new SatGroup('nameRegex', /GALILEO/);
    groups.FunGroup = new SatGroup('nameRegex', /SYLDA/);
    groups.WestfordNeedlesGroup = new SatGroup('nameRegex', /WESTFORD NEEDLES/);
    groups.SpaceXGroup = new SatGroup('nameRegex', /FALCON [19]/);
    groups.RussianTugs = new SatGroup('nameRegex', /(BREEZE-|FREGAT |BLOCK D|^SL-1)/);

    groups.Starlink = new SatGroup('nameRegex', /STARLINK/);
    groups.OneWeb = new SatGroup('nameRegex', /ONEWEB/);
    groups.Globalstar = new SatGroup('nameRegex', /GLOBALSTAR/);
    groups.O3b = new SatGroup('nameRegex', /O3B /);
    groups.PlanetLab = new SatGroup('nameRegex', /(FLOCK |SKYSAT |RAPIDEYE )/);  // DOVE 2-4 are Am Radio sats
    groups.Spire = new SatGroup('nameRegex', /LEMUR /);
    groups.Orbcomm = new SatGroup('nameRegex', /ORBCOMM /);
    groups.ChinaASAT = new SatGroup('nameRegex', /FENGYUN 1C /);  // 1999-025
    //groups.ChinaASAT = new SatGroup('intlDes', '1999-025');  // cannot do this because really need a search
    groups.GNSS = new SatGroup('nameRegex', /(QZS-|IRNSS|NAVSTAR|BEIDOU|GLONASS)/);  // see also WAAS/EGNOS/MSAS celestrak: sbas.txt

    groups.rocketbodies = new SatGroup('nameRegex', /R\/B/);

    groups.RUrocketbodies = new SatGroup('nameRegex', /(BREEZE-|FREGAT |BLOCK D|^SL-1|VOLGA).*R\/B/);
    groups.USrocketbodies = new SatGroup('nameRegex', /((DELTA|ATLAS|TITAN|PEGASUS|USA|THOR|SCOUT|IABS|IUS|AGENA|MINOTAUR|TAURUS|VANGUARD|OV1).*R\/B|R\/B.*(STAR|PAM))/);
    groups.EUrocketbodies = new SatGroup('nameRegex', /(ARIANE|DIAMANT|AVUM).*R\/B/);
    groups.JProcketbodies = new SatGroup('nameRegex', /(H-1|H-2|EPSILON|^M-).*R\/B/);
    groups.CNrocketbodies = new SatGroup('nameRegex', /(CZ-|YZ-).*R\/B/);
    groups.INrocketbodies = new SatGroup('nameRegex', /(PSLV).*R\/B/); // can't find any GSLV upper stages
    groups.SpaceXrocketbodies = new SatGroup('nameRegex', /FALCON.*R\/B/);
    groups.RocketLabrocketbodies = new SatGroup('nameRegex', /ELECTRON.*R\/B/);
    groups.NKrocketbodies = new SatGroup('nameRegex', /(UHNA).*R\/B/);
    groups.KRrocketbodies = new SatGroup('nameRegex', /KSLV.*R\/B/);
    groups.UKrocketbodies = new SatGroup('nameRegex', /(BLACK ARROW).*R\/B/);

    groups.debris = new SatGroup('nameRegex', /\bDEB\b/);
    groups.SpaceXdebris = new SatGroup('nameRegex', /FALCON.*DEB/);
    groups.RocketLabdebris = new SatGroup('nameRegex', /ELECTRON.*DEB/);
    
    console.log('groups init: ' + (performance.now() - start) + ' ms');
  };
	window.groups = groups;
	
	
})();
