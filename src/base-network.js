
//
// BaseNetwork
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
var BaseNetwork = module.exports = function(options) {

    options = options || {};

    if (options instanceof BaseNetwork) {
        options = options.export();
    }

    this.numberOfInputs = options.numberOfInputs || 1;
    this.numberOfOutputs = options.numberOfOutputs || 1;
    this.numberOfHiddenLayers = options.numberOfHiddenLayers || 1;
    this.numberOfNeuronsPerHiddenLayer = options.numberOfNeuronsPerHiddenLayer || 1;

    this.size = BaseNetwork.helper.getSizeFromOptions(this);
    this.index = BaseNetwork.helper.index(this);
    this.weights = [];

    if (Array.isArray(options.weights) && options.weights.length) {
        BaseNetwork.helper.assertWeights(options.weights, this.size);
        this.weights = options.weights.slice();
    } else {
        for (var i = 0; i < this.size; i++) {
            this.weights.push(BaseNetwork.helper.getRandomWeight());
        }
    }

    Object.defineProperty(this, "size", { writable: false });
    Object.defineProperty(this, "numberOfInputs", { writable: false });
    Object.defineProperty(this, "numberOfOutputs", { writable: false });
    Object.defineProperty(this, "numberOfHiddenLayers", { writable: false });
    Object.defineProperty(this, "numberOfNeuronsPerHiddenLayer", { writable: false });
};

//
// BaseNetwork > export
//
// Returns network options with all weights
// 
// @return Object 
//
BaseNetwork.prototype.export = function() {
    return {
        numberOfInputs: this.numberOfInputs,
        numberOfOutputs: this.numberOfOutputs,
        numberOfHiddenLayers: this.numberOfHiddenLayers,
        numberOfNeuronsPerHiddenLayer: this.numberOfNeuronsPerHiddenLayer,
        weights: this.weights.slice(),
    };
};

//
// BaseNetwork > update
//
// Update all network weights
// 
// @param  Array : Weights array
// @return BaseNetwork 
//
BaseNetwork.prototype.update = function(weights) {
    BaseNetwork.helper.assertWeights(weights, this.size);
    this.weights = weights.slice();
    return this;
};

//
// BaseNetwork > run
//
// Returns an array of sigmoid values
// 
// @param  Array : Input values
// @return Array
//
BaseNetwork.prototype.run = function(input) {

    BaseNetwork.helper.assertInputs(input, this.numberOfInputs);

    var results = BaseNetwork.helper.runLayerAsInput(this, this.index[0], input);
    
    for (var i = 1; i < this.index.length; i++) {
        results = BaseNetwork.helper.runLayer(this, this.index[i], results);
    }
    
    return results;
};

//
// BaseNetwork helper namespace
//
BaseNetwork.helper = {};

//
// BaseNetwork > helper > getRandomWeight
//
// Returns a random weight
// 
// @return Float
//
BaseNetwork.helper.getRandomWeight = function() {
    return Math.random() * 2 - 1;
};

//
// BaseNetwork > helper > size
//
// Returns the network size from options
// 
// @param  Object : BaseNetwork options
// @return Integer
//
BaseNetwork.helper.getSizeFromOptions = function(options) {
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
// BaseNetwork > helper > assertWeights
//
// Throw an exception if weigths array length is bad
// 
// @param Array : Weights
// @param Integer : Expected size
// @throw Error
//
BaseNetwork.helper.assertWeights = function(weights, size) {
    if (!(Array.isArray(weights) && weights.length === size)) {
        throw new Error('Need an array of ' + size + ' weights');
    }
};

//
// BaseNetwork > helper > assertInputs
//
// Throw an exception if inputs array length is bad
// 
// @param Array : Weights
// @param Integer : Expected size
// @throw Error
//
BaseNetwork.helper.assertInputs = function(input, size) {
    if (!(Array.isArray(input) && input.length === size)) {
        throw new Error('Need an array of ' + size + ' inputs');
    }
};

//
// BaseNetwork > helper > getSigmoidActivation
//
// Returns a weights sum activation
// 
// @param  Array : Weights
// @param  Array : Inputs data
// @return Float
//
BaseNetwork.helper.getSigmoidActivation = function(weights, input) {
    var activation = weights[0]; // Bias
    for (var i = 1, imax = weights.length; i < imax; i++) {
        activation += input[i-1] * weights[i];
    }
    return 1 / (1 + Math.exp(-activation));
};

//
// BaseNetwork > helper > index
//
// Returns the network index composition from options
// 
// @param  Object : BaseNetwork options
// @return Array
//
BaseNetwork.helper.index = function(options) {
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
// BaseNetwork > helper > runLayer
//
// Returns an array of neurons activation from input
// 
// @param  BaseNetwork
// @param  Array : Layer compostion
// @param  Array : Inputs data
// @return Array
//
BaseNetwork.helper.runLayer = function(network, layer, input) {
    var results = [];
    layer.forEach(function(neuron) {
        results.push(BaseNetwork.helper.getSigmoidActivation(network.weights.slice(neuron[0], neuron[1] + 1), input));
    });
    return results;
};

//
// BaseNetwork > helper > runLayerAsInput
//
// Returns an array of neurons activation from neurons layer
// 
// @param  BaseNetwork
// @param  Array : Layer compostion
// @param  Array : Inputs data
// @return Array
//
BaseNetwork.helper.runLayerAsInput = function(network, layer, input) {
    var results = [];
    layer.forEach(function(neuron, i) {
        results.push(BaseNetwork.helper.getSigmoidActivation(network.weights.slice(neuron[0], neuron[1] + 1), [input[i]]));
    });
    return results;
};
