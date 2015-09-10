# Novabrain

Novabrain is a Node.js [neural network](http://en.wikipedia.org/wiki/Artificial_neural_network) module.

```
$ npm install novabrain
```
### Back Propagation Training

This example shows how the neural network is trained to learn XOR

```javascript
var Novabrain = require('novabrain');
var network   = new Novabrain.Network();

network.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
], {
    callback: function(data) {
        console.log(data);
    }
});

console.log('');
console.log('----------------------------------------------');
console.log('NETWORK RUN XOR');
console.log('----------------------------------------------');
console.log('');
console.log('  - [ 0 , 0 ] = ', Math.round(network.run([0,0]) * 1) / 1);
console.log('  - [ 0 , 1 ] = ', Math.round(network.run([0,1]) * 1) / 1);
console.log('  - [ 1 , 0 ] = ', Math.round(network.run([1,0]) * 1) / 1);
console.log('  - [ 1 , 1 ] = ', Math.round(network.run([1,1]) * 1) / 1);
console.log('');
console.log('----------------------------------------------');
console.log('');

var run = network.toFunction();

console.log('');
console.log('----------------------------------------------');
console.log('STANDALONE FUNCTION RUN XOR');
console.log('----------------------------------------------');
console.log('');
console.log('  - [ 0 , 0 ] = ', Math.round(run([0,0]) * 1) / 1);
console.log('  - [ 0 , 1 ] = ', Math.round(run([0,1]) * 1) / 1);
console.log('  - [ 1 , 0 ] = ', Math.round(run([1,0]) * 1) / 1);
console.log('  - [ 1 , 1 ] = ', Math.round(run([1,1]) * 1) / 1);
console.log('');
console.log('----------------------------------------------');
console.log('');
```

### Mocha is used for unit testing
```
$ npm install mocha -g
$ mocha
$ ...
```
