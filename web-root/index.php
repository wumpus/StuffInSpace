<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Droid+Sans" type="text/css">
    <link rel="stylesheet" href="/icomoon.css" type="text/css">
    <link rel="stylesheet" href="/perfect-scrollbar.min.css" type="text/css">
    <link rel="stylesheet" href="/style.css" type="text/css">
    
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="/scripts/satellite.min.js"></script>
    <script src="/script-loader.php"></script>
    
    <?php if($_SERVER['HTTP_HOST'] === 'stuffin.space' || $_SERVER['HTTP_HOST'] === 'www.stuffin.space') { ?>
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
      
        ga('create', 'UA-64721672-1', 'auto');
        ga('send', 'pageview');
      </script> 
   <?php } else { ?>
    <!-- analytics disabled for host "<?= $_SERVER['HTTP_HOST'] ?>" -->
   <?php } ?>
    
    <title>Stuff in Space</title>
    
  </head>
  <body>
  <div id="no-webgl">
    Stuff in Space requires <a href="https://caniuse.com/#feat=webgl">WebGL</a> and <a href="https://caniuse.com/#feat=webworkers">Web Worker</a> support. 
  </div>
  <div id="canvas-holder">
    <canvas id="canvas"></canvas>
    <div id="menu-left" class="menubar">
      <div id="search-holder" class="menu-item">
        <span class="icon-search"></span>
        <input type="text" id="search"></input>
      </div>
      <div id="menu-groups" class="menu-item">
        <div class="menu-title">Groups</div>
        <ul id="groups-display" class="dropdown submenu">
          <li data-group="<clear>" class="clear-option">Clear</li>
	  <li data-group="<divider>" class="divider">- Orbits</li>
          <li data-group="GSO">GSO</li>
          <li data-group="GSOinclined">GSO inclined</li>
          <li data-group="GSOgraveyard">GSO graveyard</li>
          <li data-group="GTO">GTO</li>
          <li data-group="Molniya">Molniya</li>
          <li data-group="QuasiZenith">Quasi-Zenith</li>
	  <li data-group="SSOish">SSO-ish</li>
	  <li data-group="FrozenPeriapsis">Frozen periapsis</li>
	  <li data-group="FrozenEccentricity">Frozen eccentricity</li>
	  <li data-group="VeryLow">Very low</li>
<!--
	  <li data-group="Cluster775">Cluster at 775km</li>
	  <li data-group="Cluster850">Cluster at 850km</li>
	  <li data-group="Cluster975">Cluster at 975km</li>
-->
<!--
	  <li data-group="<divider>" class="divider">- Constellations</li>
          <li data-group="Starlink">Starlink</li>
          <li data-group="OneWeb">OneWeb</li>
          <li data-group="IridiumGroup">Iridium</li>
	  <li data-group="Globalstar">Globalstar</li>
          <li data-group="O3b">O3b</li>
          <li data-group="Orbcomm">Orbcomm</li>
          <li data-group="PlanetLab">PlanetLab</li>
          <li data-group="Spire">Spire</li>
          <li data-group="GNSS">GNSS [all countries]</li>
-->
	  <li data-group="<divider>" class="divider">- Debris and Rocket Bodies</li>

          <li data-group="RUrocketbodies">RU Rocket Bodies</li>
          <li data-group="USrocketbodies">US Rocket Bodies</li>
          <li data-group="EUrocketbodies">EU Rocket Bodies</li>
          <li data-group="JProcketbodies">JP Rocket Bodies</li>
          <li data-group="CNrocketbodies">CN Rocket Bodies</li>
          <li data-group="INrocketbodies">IN Rocket Bodies</li>
          <li data-group="SpaceXrocketbodies">SpaceX Rocket Bodies</li>
          <li data-group="RocketLabrocketbodies">RocketLab Rocket Bodies</li>
          <li data-group="KRrocketbodies">KR Rocket Bodies</li>
          <li data-group="NKrocketbodies">NK Rocket Bodies</li>
          <li data-group="UKrocketbodies">UK Rocket Bodies</li>

          <li data-group="rocketbodies">All Rocket Bodies</li>

          <li data-group="SpaceXdebris">SpaceX Debris</li>
          <li data-group="RocketLabdebris">RocketLab Rocket Debris</li>
          <li data-group="debris">All Debris</li>
          <li data-group="ChinaASAT">China ASAT Test Debris</li>
          <li data-group="Iridium33DebrisGroup">Iridium 33 Collision Debris</li>
          <li data-group="WestfordNeedlesGroup">Westford Needles</li>
	  <li data-group="RussianTugs">Russian Tug Stages</li>
	</ul>
      </div>
     <!-- <div id="menu-color-schemes" class="menu-item">
        <div class="menu-title">Color Schemes</div>
        <ul id="color-schemes-submenu" class="submenu">
          <li data-color="default">Type</li>
          <li data-color="velocity">Velocity</li>
          <li data-color="apogee">Apogee</li>
        </ul>
      </div>-->
    </div>
    <div id="menu-right" class="menubar">
      <div id="menu-help" class="menu-item">
        <div class="menu-title">Help</div>
        <div id="help-box" class="menubox submenu">
          <span class="box-header">Legend</span>
          <ul id="legend">
            <li>
               <img class="dot" src="/dot-red.png"></img>
               Satellite
             </li>
            <li>
              <img class="dot" src="/dot-blue.png"></img>
              Rocket body
            </li>
            <li>
              <img class="dot" src="/dot-grey.png"></img>
              Debris
            </li>
          </ul>
          <ul id="controls-info">
            <li>
              Left/Right click and drag to rotate camera
            </li>
            <li> Mousewheel to scroll </li>
            <li>
              Left click to select an object
            </li>
          </ul>
        
        </div>
      </div>
      <div id="menu-about" class="menu-item">
        <div class="menu-title">About</div>
        <div id="about-box" class="menubox submenu">
          <span class="box-header">Stuff in Space</span>
	  <p>constellation.fu.gg is a modified version of <a href="http://stuffin.space">Stuff in Space</a>.</p>

          <p>Stuff in Space is a realtime 3D map of objects in Earth orbit, visualized using WebGL.</p>
          
          <span class="box-header">Credits</span>
<p>Portions Copyright (c) 2020 by Greg Lindahl</p>

<p><a href="http;//stuffin.space">StuffInSpace</a> (<a href="https://github.com/jeyoder/StuffInSpace/">github repo</a>) by James Yoder</p>

<p>satellite.js (c) 2013 by Sashwat Kandadai and UCSC</p>

<p>gl-matrix (c) 2013, Brandon Jones, Colin MacKenzie IV</p>
        </div>
      </div>
    </div>
      <div id="search-results"></div>
    <div id="sat-hoverbox">(none)</div>
    <div id="sat-infobox">
      <div id="sat-info-title">This is a title</div>
      <div id="all-objects-link" class="link">Find all objects from this launch...</div>
      <div class="sat-info-row">
        <div class="sat-info-key">Int'l Designator</div>
        <div class="sat-info-value" id="sat-intl-des">1998-067A</div>
      </div>
      <div class="sat-info-row">
        <div class="sat-info-key">Type</div>
        <div class="sat-info-value" id="sat-type">PAYLOAD</div>
      </div>
      <div class="sat-info-row">
        <div class="sat-info-key">Apogee</div>
        <div class="sat-info-value" id="sat-apogee">100 km</div>
      </div>
      <div class="sat-info-row">
        <div class="sat-info-key">Perigee</div>
        <div class="sat-info-value" id="sat-perigee">100 km</div>
      </div>
       <div class="sat-info-row">
        <div class="sat-info-key">Inclination</div>
        <div class="sat-info-value" id="sat-inclination">123.45°</div>
      </div>
      <div class="sat-info-row">
        <div class="sat-info-key">Altitude</div>
        <div class="sat-info-value" id="sat-altitude">100  km</div>
      </div>
      <div class="sat-info-row">
        <div class="sat-info-key">Velocity</div>
        <div class="sat-info-value" id="sat-velocity">100  km/s</div>
      </div>
      <div class="sat-info-row">
        <div class="sat-info-key">Period</div>
        <div class="sat-info-value" id="sat-period">100  min</div>
      </div>
      <div class="sat-info-row">
        <div class="sat-info-key">Orbit Type</div>
        <div class="sat-info-value" id="sat-orbit"></div>
      </div>
    </div>
    <div id="zoom-controls">
      <div id="zoom-in" class="zoom-button">+</div>
      <div id="zoom-out" class="zoom-button">-</div>
    </div>
    <div id="load-cover">
      <div id="loader">
        <div id="spinner"></div>
        <div id="loader-text">
          Initializing...
        </div>
      </div>
    </div>
  </div>
  </body>
</html>

