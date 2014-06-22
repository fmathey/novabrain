
//
// Neuron
//
// Set of weights defined by a number of inputs
// Weights are randomly generated with a value between -1 and 1
// A bias is added to force an activation value other than 0
//
// @param Integer : Number of inputs
//
var Neuron = module.exports = function(numberOfInputs) {
    if (!numberOfInputs || numberOfInputs < 1) {
        throw new Error('Invalid number of inputs');
    }
    for (var i = 0; i < numberOfInputs + 1; i++) {
        this.push(Math.random() * 2 - 1);
    }
};

//
// Neuron prototype inherit from Array
//
Neuron.prototype = Object.create(Array.prototype);

//
// Neuron > run
//
// Returns a sigmoid value of the sum of the weights and bias
// 
// @param  Array : Input values
// @return Float : Values Between 0 and 1
//
Neuron.prototype.run = function(input) {
    if (!(Array.isArray(input) && input.length === this.length - 1)) {
        throw new Error('Neuron::run expected an array of ' + this.length - 1);
    }
    var activation = this[0]; // Bias
    for (var i = 1, imax = this.length; i < imax; i++) {
        activation += input[i-1] * this[i];
    }
    return 1 / (1 + Math.exp(-activation));
};
