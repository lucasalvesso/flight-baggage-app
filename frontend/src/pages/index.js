const sign = require('./sign');
const home = require('./home');
const scan = require('./scan');
const flights = require('./flights');
const bases = require('./bases');
const history = require('./history');
export default [...sign, home, ...scan, ...flights, ...bases, history];
