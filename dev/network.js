
var Network = require('./../src/network')

console.log('');
console.log('----------------------------------------------');
console.log('NETWORK TEST');
console.log('----------------------------------------------');
console.log('');

var network = new Network();

network.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
], function(data) {
    console.log(data);
});

var net = new Network(network);

console.log('');
console.log('----------------------------------------------');
console.log('XOR RESULTS');
console.log('----------------------------------------------');
console.log('');
console.log('  - [ 0 , 0 ] = ', Math.round(net.run([0,0]) * 1) / 1);
console.log('  - [ 0 , 1 ] = ', Math.round(net.run([0,1]) * 1) / 1);
console.log('  - [ 1 , 0 ] = ', Math.round(net.run([1,0]) * 1) / 1);
console.log('  - [ 1 , 1 ] = ', Math.round(net.run([1,1]) * 1) / 1);
console.log('');
console.log('----------------------------------------------');
console.log('');
console.log(JSON.stringify(net.export(), null, 3));