# Novabrain

Novabrain is a javascript [neural network](http://en.wikipedia.org/wiki/Artificial_neural_network) library for Node.js and browser.
This library implements a **multilayer perceptron** network that you can train to learn XOR, OR, AND ... for example.

![Perceptron](https://camo.githubusercontent.com/6cbf32d6b071f11cda62a15c7697f1381bf03789/687474703a2f2f7777772e636f646570726f6a6563742e636f6d2f4b422f646f746e65742f707265646963746f722f6e6574776f726b2e6a7067)

#### In Node.js

You can install **Novabrain** with [npm](http://npmjs.org/)

```
$ npm install novabrain --save
```
```javascript
var Novabrain = require('novabrain');
var Neuron    = Novabrain.Neuron;
var Layer     = Novabrain.Layer;
var Network   = Novabrain.Network;
var Trainer   = Novabrain.Trainer;
var Transfer  = Novabrain.Transfer;
var Samples   = Novabrain.Samples;
```

#### In the browser

You can also use the minified version to increase your web page loading

```html
<script type="text/javascript" src="novabrain.js"></script>
```

```html
<script type="text/javascript">
	(function() {
	
		var network = new Novabrain.Network(2,1);
		
		network.import(Novabrain.Samples.XOR.config);
		
		network.transfer = Novabrain.Transfer.BOOLEAN;
		
		console.log([0,0], network.output([0,0])); // [false]
		console.log([0,1], network.output([0,1])); // [true]
		console.log([1,0], network.output([1,0])); // [true]
		console.log([1,1], network.output([1,1])); // [false]
		
	})();
</script>
```

### Create a network

Constructor expected an intergers suite.
The first value is the input size
The last value is the output size
Between this values you can set many hidden size (2, 3, ..., 1)

```javascript
new Novabrain.Network(2,1);
new Novabrain.Network(2,3,1);
new Novabrain.Network(5,4,4,2);
```

### Samples

Novabrain samples contains **training** and **config** for basics functions

```javascript
Novabrain.Samples.XOR
Novabrain.Samples.AND
Novabrain.Samples.OR
```

### Back Propagation Training

This example shows how the neural network is trained to learn XOR

```javascript
var network = new Novabrain.Network(2,1);
var trainer = new Novabrain.Trainer(network);

trainer.train([
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] },
]);

console.log([0,0], network.output([0,0])); // [~0.05]
console.log([0,1], network.output([0,1])); // [~0.93]
console.log([1,0], network.output([1,0])); // [~0.93]
console.log([1,1], network.output([1,1])); // [~0.09]

network.transfer = Novabrain.Transfer.BOOLEAN;

console.log([0,0], network.output([0,0])); // [false]
console.log([0,1], network.output([0,1])); // [true]
console.log([1,0], network.output([1,0])); // [true]
console.log([1,1], network.output([1,1])); // [false]
```

### Transfer functions

The transfer functions are used to change the value of the outputs.
By default, neurons uses a Logistic Sigmoid transfer.
You can change those properties the following way.

```javascript
network.transfer = Novabrain.Transfer.BOOLEAN;

console.log([0,0], network.output([0,0])); // [false]
console.log([0,1], network.output([0,1])); // [true]
console.log([1,0], network.output([1,0])); // [true]
console.log([1,1], network.output([1,1])); // [false]
```

[LOGISTIC](http://commons.wikimedia.org/wiki/File:SigmoidFunction.png)  
Return logistic sigmoid values

[HARDLIMIT](http://commons.wikimedia.org/wiki/File:HardLimitFunction.png)  
Return 0 or 1 values

[BOOLEAN](http://commons.wikimedia.org/wiki/File:HardLimitFunction.png)  
Return boolean values like HARDLIMIT

[IDENTIFY](http://en.wikipedia.org/wiki/File:Function-x.svg)  
Return sum values without transfer

[TANH](http://commons.wikimedia.org/wiki/File:TanhFunction.jpg)  
Return values between -1 and 1 

### Export and import data

```javascript
var n1 = new Novabrain.Network(2,1);
var n2 = new Novabrain.Network(2,1);

n2.import(n1);
// or
n2.import(n1.export());

var results = n2.output([...]));
```

### Create a standalone function

By default the transfer function used is LOGISITC but you can change this by two ways.
Define your custom transfer before the standalone function export or set the transfer param when you use the standalone function.

```javascript
var standalone = network.standalone();
var booleanResults = standalone([...], Novabrain.Transfer.BOOLEAN));
```

```javascript
var standalone = network.standalone(Novabrain.Transfer.BOOLEAN);
var booleanResults = standalone([...]));
var tanhResults = standalone([...], Novabrain.Transfer.TANH));
```

### Mocha is used for unit testing

```
$ npm test
```

```
$ make tests
```

```
$ npm install mocha -g
$ mocha
```

### Contribute

**Novabrain** is an Open Source project started in France by François Mathey.
Anybody is welcome to contribute to the development of this project.

If you want to contribute feel free to send PR's, just make sure to run the **make** before submiting it.
This way you'll run all the test specs and build the web distribution files.

```
$ make
```

Thank you <3
