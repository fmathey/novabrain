var Novabrain = require('./../index');
var Transfer  = Novabrain.Transfer;

var network = new Novabrain.Network(2,1);
var trainer = new Novabrain.Trainer(network);

trainer.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
]);

console.log('#LOGISTIC');

console.log([0,0], network.output([0,0]));
console.log([0,1], network.output([0,1]));
console.log([1,0], network.output([1,0]));
console.log([1,1], network.output([1,1]));

console.log('#IDENTITY');

network.transfer = Transfer.IDENTITY;

console.log([0,0], network.output([0,0]));
console.log([0,1], network.output([0,1]));
console.log([1,0], network.output([1,0]));
console.log([1,1], network.output([1,1]));

console.log('#HARDLIMIT');

network.transfer = Transfer.HARDLIMIT;

console.log([0,0], network.output([0,0]));
console.log([0,1], network.output([0,1]));
console.log([1,0], network.output([1,0]));
console.log([1,1], network.output([1,1]));

console.log('#BOOLEAN');

network.transfer = Transfer.BOOLEAN;

console.log([0,0], network.output([0,0]));
console.log([0,1], network.output([0,1]));
console.log([1,0], network.output([1,0]));
console.log([1,1], network.output([1,1]));

console.log('#TANH');

network.transfer = Transfer.TANH;

console.log([0,0], network.output([0,0]));
console.log([0,1], network.output([0,1]));
console.log([1,0], network.output([1,0]));
console.log([1,1], network.output([1,1]));
