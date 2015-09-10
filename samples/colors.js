
var Novabrain = require('../index');

var network = new Novabrain.Network();

network.train([
    { input: [0,0,0], output: [1,1,1] },
    { input: [1,1,1], output: [0,0,0] },
]);

console.log('');
console.log('----------------------------------------------');
console.log('NETWORK RUN COLORS');
console.log('----------------------------------------------');
console.log('');
console.log('  - [ 0 , 0 , 0 ] = ', network.run([0,0,0]));
console.log('  - [ 1 , 1 , 1 ] = ', network.run([1,1,1]));
console.log('');
console.log('----------------------------------------------');
console.log('');