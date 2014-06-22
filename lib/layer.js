

var Neuron = require('./neuron');

//
// Layer
//
// Set of neurons
//
// @param Integer : Number of neurons
// @param Integer : NumberOfInputsPerNeuron
//
var Layer = module.exports = function(numberOfNeurons, numberOfInputsPerNeuron) {
    if (!numberOfNeurons || numberOfNeurons < 1) {
        throw new Error('Invalid number of neurons');
    }
    if (!numberOfInputsPerNeuron || numberOfInputsPerNeuron < 1) {
        throw new Error('Invalid number of inputs per neuron');
    }
    for (var i = 0; i < numberOfNeurons; i++) {
        this.push(new Neuron(numberOfInputsPerNeuron));
    }
};

//
// Layer prototype inherit from Array
//
Layer.prototype = Object.create(Array.prototype);

//
// Layer > run
//
// Returns an array of activations neurons
// 
// @param  Array : Input values
// @return Array
//
Layer.prototype.run = function(input) {
    var results = [];
    this.forEach(function(neuron) {
        results.push(neuron.run(input));
    });
    return results;
};

//
// Layer > runAsInput
//
// Returns an array of activations neurons by input value
// 
// @param  Array : Input values
// @return Array
//
Layer.prototype.runAsInput = function(input) {
    var results = [];
    this.forEach(function(neuron, i) {
        results.push(neuron.run([input[i]]));
    });
    return results;
};
