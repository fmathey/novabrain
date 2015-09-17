var Novabrain = require('./../index');

var network = new Novabrain.Network(2, 3, 1);
var trainer = new Novabrain.Trainer(network);

trainer.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
]);

var standalone = network.standalone();

console.log([0,0], standalone([0,0])); // false
console.log([0,1], standalone([0,1])); // true
console.log([1,0], standalone([1,0])); // true
console.log([1,1], standalone([1,1])); // false
