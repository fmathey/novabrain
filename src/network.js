
//
// Network
//
// Neural Network Base
//
// Options : {
//     numberOfInputs: 1,
//     numberOfOutputs: 1,
//     numberOfHiddenLayers: 1,
//     numberOfNeuronsPerHiddenLayer: 1,
//     weights: [
//         0.042384160216897726,
//        -0.4777564317919314,
//         0.5611297953873873,
//        -0.30416952446103096,
//        -0.6487653669901192,
//         0.18558572605252266,
//     ]
// }
//
// @param Object : Network options
//
var Network = module.exports = function(options) {

    options = options || {};

    if (options instanceof Network) {
        options = options.export();
    }

    this.numberOfInputs = options.numberOfInputs || 1;
    this.numberOfOutputs = options.numberOfOutputs || 1;
    this.numberOfHiddenLayers = options.numberOfHiddenLayers || 1;
    this.numberOfNeuronsPerHiddenLayer = options.numberOfNeuronsPerHiddenLayer || 1;

    this.size = Network.helpers.getSizeFromOptions(this);
    this.index = Network.helpers.index(this);
    this.weights = [];

    if (Array.isArray(options.weights) && options.weights.length) {
        Network.helpers.assertWeights(options.weights, this.size);
        this.weights = options.weights.slice();
    } else {
        for (var i = 0; i < this.size; i++) {
            this.weights.push(Network.helpers.getRandomWeight());
        }
    }

    Object.defineProperty(this, "size", { writable: false });
    Object.defineProperty(this, "numberOfInputs", { writable: false });
    Object.defineProperty(this, "numberOfOutputs", { writable: false });
    Object.defineProperty(this, "numberOfHiddenLayers", { writable: false });
    Object.defineProperty(this, "numberOfNeuronsPerHiddenLayer", { writable: false });
};

//
// Network > export
//
// Returns network options with all weights
// 
// @return Object 
//
Network.prototype.export = function() {
    return {
        numberOfInputs: this.numberOfInputs,
        numberOfOutputs: this.numberOfOutputs,
        numberOfHiddenLayers: this.numberOfHiddenLayers,
        numberOfNeuronsPerHiddenLayer: this.numberOfNeuronsPerHiddenLayer,
        weights: this.weights.slice(),
    };
};

//
// Network > update
//
// Update all network weights
// 
// @param  Array : Weights array
// @return Network 
//
Network.prototype.update = function(weights) {
    Network.helpers.assertWeights(weights, this.size);
    this.weights = weights.slice();
    return this;
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

    Network.helpers.assertInputs(input, this.numberOfInputs);

    var results = Network.helpers.runLayerAsInput(this, this.index[0], input);
    
    for (var i = 1; i < this.index.length; i++) {
        results = Network.helpers.runLayer(this, this.index[i], results);
    }
    
    return results;
};

//
// Network helpers namespace
//
Network.helpers = {};

//
// Network > helpers > getRandomWeight
//
// Returns a random weight
// 
// @return Float
//
Network.helpers.getRandomWeight = function() {
    return Math.random() * 2 - 1;
};

//
// Network > helpers > size
//
// Returns the network size from options
// 
// @param  Object : Network options
// @return Integer
//
Network.helpers.getSizeFromOptions = function(options) {
    var size = 0;
    size  = options.numberOfInputs + options.numberOfInputs;
    size += options.numberOfNeuronsPerHiddenLayer * (options.numberOfInputs + 1);
    size += options.numberOfOutputs * (options.numberOfNeuronsPerHiddenLayer + 1);
    if (options.numberOfHiddenLayers > 1) {
        size += options.numberOfNeuronsPerHiddenLayer *
            (options.numberOfNeuronsPerHiddenLayer + 1) *
            (options.numberOfHiddenLayers - 1);
    }
    return size;
};

//
// Network > helpers > assertWeights
//
// Throw an exception if weigths array length is bad
// 
// @param Array : Weights
// @param Integer : Expected size
// @throw Error
//
Network.helpers.assertWeights = function(weights, size) {
    if (!(Array.isArray(weights) && weights.length === size)) {
        throw new Error('Need an array of ' + size + ' weights');
    }
};

//
// Network > helpers > assertInputs
//
// Throw an exception if inputs array length is bad
// 
// @param Array : Weights
// @param Integer : Expected size
// @throw Error
//
Network.helpers.assertInputs = function(input, size) {
    if (!(Array.isArray(input) && input.length === size)) {
        throw new Error('Need an array of ' + size + ' inputs');
    }
};

//
// Network > helpers > getSigmoidActivation
//
// Returns a weights sum activation
// 
// @param  Array : Weights
// @param  Array : Inputs data
// @return Float
//
Network.helpers.getSigmoidActivation = function(weights, input) {
    var activation = weights[0]; // Bias
    for (var i = 1, imax = weights.length; i < imax; i++) {
        activation += input[i-1] * weights[i];
    }
    return 1 / (1 + Math.exp(-activation));
};

//
// Network > helpers > index
//
// Returns the network index composition from options
// 
// @param  Object : Network options
// @return Array
//
Network.helpers.index = function(options) {
    var index   = [];
    var offset  = 0;
    var neurons = [];

    var push = function (offset, nbNeurons, nbInputsPerNeuron) {
        var data = [];
        var from = 0;
        var to   = 0;
        for (var i = 0; i < nbNeurons; i++) {
            from = offset;
            for (var j = 0; j < nbInputsPerNeuron; j++) {
                to   = from + nbInputsPerNeuron;
                offset = to + 1;
            }
            data.push([from, to]);
        }
        index.push(data);
        return offset;
    };
    
    offset = push(offset, options.numberOfInputs, 1);
    
    for (var i = 0; i < options.numberOfHiddenLayers; i++) {
        if (i === 0) {
            offset = push(
                offset,
                options.numberOfNeuronsPerHiddenLayer,
                options.numberOfInputs
            );
        } else {
            offset = push(
                offset,
                options.numberOfNeuronsPerHiddenLayer,
                options.numberOfNeuronsPerHiddenLayer
            );
        }
    }
    
    push(
        offset, 
        options.numberOfOutputs,
        options.numberOfNeuronsPerHiddenLayer
    );
    
    return index;
};

//
// Network > helpers > runLayer
//
// Returns an array of neurons activation from input
// 
// @param  Network
// @param  Array : Layer compostion
// @param  Array : Inputs data
// @return Array
//
Network.helpers.runLayer = function(network, layer, input) {
    var results = [];
    layer.forEach(function(neuron) {
        results.push(Network.helpers.getSigmoidActivation(network.weights.slice(neuron[0], neuron[1] + 1), input));
    });
    return results;
};

//
// Network > helpers > runLayerAsInput
//
// Returns an array of neurons activation from neurons layer
// 
// @param  Network
// @param  Array : Layer compostion
// @param  Array : Inputs data
// @return Array
//
Network.helpers.runLayerAsInput = function(network, layer, input) {
    var results = [];
    layer.forEach(function(neuron, i) {
        results.push(Network.helpers.getSigmoidActivation(network.weights.slice(neuron[0], neuron[1] + 1), [input[i]]));
    });
    return results;
};
