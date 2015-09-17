var Novabrain = require('./../index');

var network = new Novabrain.Network(2,1);
var trainer = new Novabrain.Trainer(network);

trainer.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [0] },
    { input: [1,0], output: [0] },
    { input: [1,1], output: [1] },
]);

console.log([0,0], network.output([0,0]));
console.log([0,1], network.output([0,1]));
console.log([1,0], network.output([1,0]));
console.log([1,1], network.output([1,1]));
