
var fs    = require('fs');
var Layer = require('./layer');

//
// Network
//
// Set of layers
//
// @param Object : Network options
//
var Network = module.exports = function(options) {
    options = options || {};
    this.options = {};
    this.options.numberOfInputs = options.numberOfInputs || 1;
    this.options.numberOfOutputs = options.numberOfOutputs || 1;
    this.options.numberOfHiddenLayers = options.numberOfHiddenLayers || 1;
    this.options.numberOfNeuronsPerHiddenLayer = options.numberOfNeuronsPerHiddenLayer || 1;

    // Input layer
    this.push(new Layer(this.options.numberOfInputs, 1));

    // Hidden Layers
    for (var i = 0; i < this.options.numberOfHiddenLayers; i++) {
        if (i === 0) {
            this.push(new Layer(
                this.options.numberOfNeuronsPerHiddenLayer,
                this.options.numberOfInputs
            ));
        } else {
            this.push(new Layer(
                this.options.numberOfNeuronsPerHiddenLayer,
                this.options.numberOfNeuronsPerHiddenLayer
            ));
        }
    }

    // Output layer
    this.push(new Layer(
        this.options.numberOfOutputs,
        this.options.numberOfNeuronsPerHiddenLayer
    ));

    //Import all the weights
    if(options && options.weights && Array.isArray(options.weights) && options.weights.length) {
        this.update(options.weights);
    }
};

//
// Network prototype inherit from Array
//
Network.prototype = Object.create(Array.prototype);

//
// Network > size
//
// Returns the network size
// 
// @return Integer
//
Network.prototype.size = function() {
    var size = 0;
    size += this.options.numberOfInputs + this.options.numberOfInputs;
    size += this.options.numberOfNeuronsPerHiddenLayer * (this.options.numberOfInputs + 1);
    size += this.options.numberOfOutputs * (this.options.numberOfNeuronsPerHiddenLayer + 1);
    if (this.options.numberOfHiddenLayers > 1) {
        size += this.options.numberOfNeuronsPerHiddenLayer *
            (this.options.numberOfNeuronsPerHiddenLayer + 1) *
            (this.options.numberOfHiddenLayers - 1);
    }
    return size;
};

//
// Network > run
//
// Returns an array of sigmoid values
// 
// @param  Array : Input values
// @return Array
//
Network.prototype.run = function(input) {

    if (!(Array.isArray(input) && input.length === this.options.numberOfInputs)) {
        throw new Error('Network::run expected an array of ' + this.options.numberOfInputs);
    }

    var results = this[0].runAsInput(input);
    
    for (var i = 1, imax = this.length; i < imax; i ++) {
        results = this[i].run(results);
    }

    return results;
};

//
// Network > export
//
// Returns network options with all weights
// 
// @return Object 
//
Network.prototype.export = function() {

    var opts = {
        numberOfInputs: this.options.numberOfInputs,
        numberOfOutputs: this.options.numberOfOutputs,
        numberOfHiddenLayers: this.options.numberOfHiddenLayers,
        numberOfNeuronsPerHiddenLayer: this.options.numberOfNeuronsPerHiddenLayer,
        weights: [],
    };

    this.forEach(function(layer) {
        layer.forEach(function(neuron) {
            neuron.forEach(function(weight) {
                opts.weights.push(weight);
            });
        });
    });

    return opts;
};

//
// Network > update
//
// Update all network weights;
// 
// @param  Array : Weights array
// @return Network 
//
Network.prototype.update = function(weights) {
    if(!(Array.isArray(weights) && weights.length === this.size())) {
        throw new Error('Network::import expected an array of ' + this.size() + ' values');
    }
    var counter = 0;
    this.forEach(function(layer) {
        layer.forEach(function(neuron) {
            neuron.forEach(function(weight, i) {
                neuron[i] = weights[counter];
                counter++;
            });
        });
    });
    return this;
};
