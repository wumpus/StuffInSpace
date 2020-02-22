var orbits = [
  {
    name: 'GSO',
    altitude: [35586, 35986],
    inclination: [-7.4, 7.4],
  },
  {
    name: 'GSO inclined',
    altitude: [35586, 35986],
    inclination: [-90., -7.4, 7.4, 90.],
  },
  {
    name: 'GSO graveyard',
    altitude: [34086, 35586, 35986, 37486],
    inclination: [-15., 15.],
  },
  {
    name: 'GTO',
    perigee: [0., 9000.],  // include partly-to-gto (Centaur)
    apogee: [34000., 70000.],  // supersync
    inclination: [-60., 60.],  // remove Molniyas at 63.4 degrees
  },
  {
    name: 'GTO',
    perigee: [0., 1000.],  // no partly to GTO
    apogee: [16000., 70000.],  // subGTO (such as pslv, falcon)
    inclination: [-60., 60.],  // remove Molniyas at 63.4 degrees
  },
  {
    name: 'Tundra',
    inclination: [63.0, 63.8],  // 63.4
    period: [1400., 1480.],  // minutes... 1436
  },
  {
    name: 'Molniya',
    inclination: [63.0, 63.8],  // 63.4
    period: [700., 740.],  // minutes... 718
  },
  {
    name: 'Quasi-Zenith',
    altitude: [30000., 40000.],
    inclination: [40.5, 43.5],
  },
  {
    name: 'SSO-ish',
    altitude: [240., 1289.],  // 282 ... 1269
    inclination: [94.6, 102.7],  // 96.6 ... 100.7
  },
  // https://amostech.com/TechnicalPapers/2019/Orbital-Debris/McKnight.pdf
  {
    name: 'Cluster 775km',  // 101 objects of 1,000kg ... I see 311
    altitude: [755., 795.],  // span 40
    //inclination: [0., 0.],  // a few not polar?
  },
  {
    name: 'Cluster 850km',  // 75 objects of 2,700kg  ... I see 267 including Fengyun 1C DEB, NOAA 16 DEB, DMSP DEB
    altitude: [827., 873.],  // span 45
    //inclination: [0., 0.],  // looks all polar
    // example Cosmos 2227, Tselina-2 ELINT... ditto for Cosmos 1697... 130 total of all types but maybe multiple orbits?
    //  T-2 4 through Cosmos 1750... 8 more through Cosmos 2000... 4 more through Cosmos 2250
  },
  {
    name: 'Cluster 975km',  // 314 objects of 1,000kg ... I see 593
    altitude: [917., 1033.],  // span 115
    //inclination: [0., 0.],  // looks all polar
    // example object: Cosmos 755, a Parus
    // https://en.wikipedia.org/wiki/Parus_(satellite) -- 99 launched ... 825kg ... 1975-2009?
  },
  {
    name: '',
    altitude: [0., 0.],
    inclination: [0., 0.],
  },
];

var R2D = 180 / Math.PI;

function checkAltitude(altitude, sat) {
  if (sat.perigee > altitude[0] && sat.apogee < altitude[1])
    return true;
  if (altitude.length < 4)
    return false;
  if (sat.perigee > altitude[2] && sat.apogee < altitude[3])
    return true;
}

function checkValue(inclination, satValue) {
  if (satValue > inclination[0] && satValue < inclination[1])
    return true;
  if (inclination.length < 4)
    return false;
  if (satValue > inclination[2] && satValue < inclination[3])
    return true;
}

function classifyOrbit(sat, wanted) {
  for (var o of orbits) {
    if (o.name == '')
      continue;
    if (wanted && o.name != wanted)
      continue;

    if ('altitude' in o && !checkAltitude(o.altitude, sat)) {
      continue;
    }
    if ('perigee' in o && !checkValue(o.perigee, sat.perigee)) {
      continue;
    }
    if ('apogee' in o && !checkValue(o.apogee, sat.apogee)) {
      continue;
    }
    if ('inclination' in o && !checkValue(o.inclination, sat.inclination * R2D)) {
      continue;
    }
    if ('period' in o && !checkValue(o.period, sat.period)) {
      continue;
    }
    return o.name;
  }
  return '';
}
