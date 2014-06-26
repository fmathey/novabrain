# Novabrain

Novabrain is a Node.js [neural network](http://en.wikipedia.org/wiki/Artificial_neural_network) module.
At this moment training is made with a genetic algorithm.

```
$ npm install novabrain
```

This example shows how the neural network is trained to learn XOR with Genetic Algorithm

```javascript
var novabrain = require('novabrain');

var network = new novabrain.NetworkGenetic({
    numberOfInputs: 2,
    numberOfOutputs: 1,
    numberOfHiddenLayers: 2,
    numberOfNeuronsPerHiddenLayer : 5,
    populationSize : 400,
    maxIterations  : 2000,
    mutationRate   : 0.9,
    survivalRate   : 0.3,
    maxPerbutation : 0.9,
    errorThreshold : 0.005,
    floodCallback  : function(data) {
        console.log(data);
    }
});

network.train([ 
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
]);

console.log('');
console.log('----------------------------------------------');
console.log('XOR RESULTS');
console.log('----------------------------------------------');
console.log('');
console.log('  - [ 0 , 0 ] = ', Math.round(network.run([0,0]) * 1) / 1);
console.log('  - [ 0 , 1 ] = ', Math.round(network.run([0,1]) * 1) / 1);
console.log('  - [ 1 , 0 ] = ', Math.round(network.run([1,0]) * 1) / 1);
console.log('  - [ 1 , 1 ] = ', Math.round(network.run([1,1]) * 1) / 1);
console.log('');
```

Mocha is used for unit testing
```
$ npm install mocha -g
$ mocha
$ mocha test
$ mocha test/neuron
$ ...
```
