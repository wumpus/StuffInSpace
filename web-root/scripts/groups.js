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
  
  groups.setSelectMenu = function(str) {
    if ( str ) {
      $('#menu-groups .menu-title').text('Group: ' + str);
      $('#menu-groups .clear-option').css({
        display: 'block'
      });
    } else {
      $('#menu-groups .menu-title').text('Groups');
      $('#menu-groups .clear-option').css({
        display: 'none'
      });
    }
  };

  groups.clearSelectMenu = function() {
    $('#menu-groups .menu-title').text('Groups');
    $('#menu-groups .clear-option').css({
      display: 'none'
    });
  };

  groups.clearSelect = function() {
    //searchBox.hideResults(); // hideResults calls clearSelect
    groups.selectedGroup = null;
    satSet.setColorScheme(ColorScheme.default);
  };
	
	groups.init = function() {
    var start = performance.now();
    
    var clicked = false;
    $('#groups-display').mouseout(function() {
      if(!clicked) {
        if(searchBox.isResultBoxOpen()) {
          lrg = searchBox.getLastResultGroup();
	  if ( lrg != null ) {
            groups.selectGroup(lrg);
          }
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
	  // stop propagation? e.stopImmediatePropagation();
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
       groups.selectGroup(groups[groupName]);
      }
		});
    
    $('#groups-display>li').click(function() {
      var groupName = $(this).data('group');
      if(groupName === '<divider>') {
        ;
      } else if(groupName === '<clear>') {
        groups.clearSelect();
        groups.clearSelectMenu();
      } else {
        // if I click the group I'm already viewing, should nothing happen? XXX
        // ok, side-effect, should clear the search even if I click on the same group 
        clicked = true;
        selectSat(-1);
        searchBox.clearSearchBox();
        groups.selectGroup(groups[groupName]);
        searchBox.fillResultBox(groups[groupName].sats, '');
        searchBox.setLastResultGroup(groups[groupName]);
        groups.setSelectMenu($(this).text())
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
    groups.INrocketbodies = new SatGroup('nameRegex', /(PSLV).*R\/B/); // no GSLV... the paper on GSLV-D5 says they use a really low perigee for GTO
    groups.SpaceXrocketbodies = new SatGroup('nameRegex', /FALCON.*R\/B/);
    groups.RocketLabrocketbodies = new SatGroup('nameRegex', /ELECTRON.*R\/B/);
    groups.NKrocketbodies = new SatGroup('nameRegex', /(UNHA).*R\/B/);
    groups.KRrocketbodies = new SatGroup('nameRegex', /KSLV.*R\/B/);
    groups.UKrocketbodies = new SatGroup('nameRegex', /(BLACK ARROW).*R\/B/);

    groups.debris = new SatGroup('nameRegex', /\bDEB\b/);
    groups.SpaceXdebris = new SatGroup('nameRegex', /FALCON.*DEB/);
    groups.RocketLabdebris = new SatGroup('nameRegex', /ELECTRON.*DEB/);

    $('#groups-display').children('li').each(function(idx, itm) { 
      groupName = $(itm).data('group');
      if ( groupName.startsWith('<') ) {
        return;
      }
      group_length = groups[groupName].count();
      mouseover_innerHTML = itm.innerHTML;
      itm.innerHTML = mouseover_innerHTML + ' (' + group_length + ')';
    });

    
    console.log('groups init: ' + (performance.now() - start) + ' ms');
  };
	window.groups = groups;
	
	
})();
