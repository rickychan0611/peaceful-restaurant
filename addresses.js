const address_linees = [
  {
    name: 'Broadway',
    address_line: '532 W. Broadway',
    address_city: 'Vancouver',
    phone: ['604-879-9878', '604-559-9511', '604-559-9522'],
    id: 2,
    lat: 49.2629367,
    lng: -123.1182306,
    open_hours: {
      monday: { open: '11:00am', close: '9:00pm' },
      tuesday: { open: '11:00am', close: '9:00pm' },
      wednesday: { open: '11:00am', close: '9:00pm' },
      thursday: { open: '11:00am', close: '9:00pm' },
      friday: { open: '11:00am', close: '9:00pm' },
      saturday: { open: '11:00am', close: '9:00pm' },
      sunday: { open: '11:00am', close: '9:00pm' }
    },
    status: 3
  },
  {
    name: 'Mount Pleasant',
    address_line: '43 E. 5th Avenue',
    address_city: 'Vancouver',
    phone: ['604-559-9511'],
    id: 3,
    lat: 49.26671,
    lng: -123.10369,
    open_hours: {
      monday: { open: '11:00am', close: '9:00pm' },
      tuesday: { open: '11:00am', close: '9:00pm' },
      wednesday: { open: '11:00am', close: '9:00pm' },
      thursday: { open: '11:00am', close: '9:00pm' },
      friday: { open: '11:00am', close: '9:00pm' },
      saturday: { open: '11:00am', close: '9:00pm' },
      sunday: { open: '11:00am', close: '9:00pm' }
    },
    status: 4
  },
  {
    name: 'Kitsilano',
    address_line: '2394 W. 4th Avenue',
    address_city: 'Vancouver',
    phone: ['604-559-9533'],
    id: 4,
    lat: 49.2680246,
    lng: -123.1618086,
    open_hours: {
      monday: { open: '11:00am', close: '9:00pm' },
      tuesday: { open: '11:00am', close: '9:00pm' },
      wednesday: { open: '11:00am', close: '9:00pm' },
      thursday: { open: '11:00am', close: '9:00pm' },
      friday: { open: '11:00am', close: '9:00pm' },
      saturday: { open: '11:00am', close: '9:00pm' },
      sunday: { open: '11:00am', close: '9:00pm' }
    },
    status: 3
  },
  {
    name: 'Seymour',
    address_line: '602 Seymour St.',
    address_city: 'Vancouver',
    phone: ['604-313-1333'],
    id: 5,
    lat: 49.2828235,
    lng: -123.1175973,
    open_hours: {
      monday: { open: '11:00am', close: '9:00pm' },
      tuesday: { open: '11:00am', close: '9:00pm' },
      wednesday: { open: '11:00am', close: '9:00pm' },
      thursday: { open: '11:00am', close: '9:00pm' },
      friday: { open: '11:00am', close: '9:00pm' },
      saturday: { open: '11:00am', close: '9:00pm' },
      sunday: { open: '11:00am', close: '9:00pm' }
    },
    status: 3
  },
  {
    name: 'Newton',
    address_line: '#107-7320 King George Blvd.',
    address_city: 'Surrey',
    phone: ['604-503-3833'],
    id: 6,
    lat: 49.1346551,
    lng: -122.8452272,
    open_hours: {
      monday: { open: '11:00am', close: '9:00pm' },
      tuesday: { open: '11:00am', close: '9:00pm' },
      wednesday: { open: '11:00am', close: '9:00pm' },
      thursday: { open: '11:00am', close: '9:00pm' },
      friday: { open: '11:00am', close: '9:00pm' },
      saturday: { open: '11:00am', close: '9:00pm' },
      sunday: { open: '11:00am', close: '9:00pm' }
    },
    status: 4
  },
  {
    name: 'Kingsway',
    address_line: '3320 Kingsway',
    address_city: 'Vancouver',
    phone: ['604-428-1168'],
    id: 7,
    lat: 49.2333749,
    lng: -123.036679,
    open_hours: {
      monday: { open: '11:00am', close: '9:00pm' },
      tuesday: { open: '11:00am', close: '9:00pm' },
      wednesday: { open: '11:00am', close: '9:00pm' },
      thursday: { open: '11:00am', close: '9:00pm' },
      friday: { open: '11:00am', close: '9:00pm' },
      saturday: { open: '11:00am', close: '9:00pm' },
      sunday: { open: '11:00am', close: '9:00pm' }
    },
    status: 3
  },
  {
    name: 'Port Coquitlam',
    address_line: '3610 Westwood St.',
    address_city: 'Port Coquitlam',
    phone: ['778-285-3367'],
    id: 8,
    lat: 49.276555,
    lng: -122.7923259,
    open_hours: {
      monday: { open: '11:00am', close: '9:00pm' },
      tuesday: { open: '11:00am', close: '9:00pm' },
      wednesday: { open: '11:00am', close: '9:00pm' },
      thursday: { open: '11:00am', close: '9:00pm' },
      friday: { open: '11:00am', close: '9:00pm' },
      saturday: { open: '11:00am', close: '9:00pm' },
      sunday: { open: '11:00am', close: '9:00pm' }
    },
    status: 3
  },
  {
    name: 'Richmond',
    address_line: '110D – 2188 No.5 Rd.',
    address_city: 'Vancouver',
    phone: ['604-1230-4567'],
    id: 9,
    lat: 49.1953273,
    lng: -123.093141,
    open_hours: {
      monday: { open: '11:00am', close: '9:00pm' },
      tuesday: { open: '11:00am', close: '9:00pm' },
      wednesday: { open: '11:00am', close: '9:00pm' },
      thursday: { open: '11:00am', close: '9:00pm' },
      friday: { open: '11:00am', close: '9:00pm' },
      saturday: { open: '11:00am', close: '9:00pm' },
      sunday: { open: '11:00am', close: '9:00pm' }
    },
    status: 4
  }
];

export default address_linees;
