var Novabrain = require('./../index');

var network = new Novabrain.Network(2,1);
var trainer = new Novabrain.Trainer(network);

trainer.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
]);

// Use default transfer LOGISITIC

console.log([0,0], network.output([0,0])); // [~0.05]
console.log([0,1], network.output([0,1])); // [~0.93]
console.log([1,0], network.output([1,0])); // [~0.93]
console.log([1,1], network.output([1,1])); // [~0.09]

network.transfer = Novabrain.Transfer.BOOLEAN;

console.log([0,0], network.output([0,0])); // [false]
console.log([0,1], network.output([0,1])); // [true]
console.log([1,0], network.output([1,0])); // [true]
console.log([1,1], network.output([1,1])); // [false]
