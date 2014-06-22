# Novabrain

Novabrain is a Node.js [neural network](http://en.wikipedia.org/wiki/Artificial_neural_network) module.
At this moment training is made with a genetic algorithm.

```
$ npm install novabrain
```

This example shows how the neural network is trained to learn XOR with Genetic Algorithm

```javascript
var assert = require('assert');
var novabrain = require('novabrain');

var network = new novabrain.Network({
    numberOfInputs: 2,
    numberOfOutputs: 1,
    numberOfHiddenLayers: 2,
    numberOfNeuronsPerHiddenLayer : 5,
});

var trainer = new novabrain.GeneticTrainer({
    populationSize : 400,
    maxIterations  : 2000,
    mutationRate   : 0.8,
    survivalRate   : 0.3,
    maxPerbutation : 0.9,
});

trainer.train(network, [ 
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
]);

assert.strictEqual(Math.round(network.run([0,0]) * 1) / 1, 0);
assert.strictEqual(Math.round(network.run([0,1]) * 1) / 1, 1);
assert.strictEqual(Math.round(network.run([1,0]) * 1) / 1, 1);
assert.strictEqual(Math.round(network.run([1,1]) * 1) / 1, 0);
```
Mocha is used for unit testing
```
$ npm install mocha -g
$ mocha
$ mocha test
$ mocha test/neuron
$ ...
```
