const safe = require('safe-regex');
const regex = process.argv.slice(2).join(' ');
console.log(safe(regex));
