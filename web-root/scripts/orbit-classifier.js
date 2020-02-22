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
  {
    name: '',
    altitude: [0., 0.],
    inclination: [0., 0.],
  },
  {
    name: '',
    altitude: [0., 0.],
    inclination: [0., 0.],
  },
  {
    name: '',
    altitude: [0., 0.],
    inclination: [0., 0.],
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

function classifyOrbit(sat) {
  for (var o of orbits) {
    if (o.name == '')
      continue;

    if ('altitude' in o && !checkAltitude(o.altitude, sat)) {
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
