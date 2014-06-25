
//
// Network
//
// Neural Network
//
// @param Object : Network options
//
var Network = module.exports = function(options) {

    options = options || {};

    if (options instanceof Network) {
        options = options.export();
    }

    options.numberOfInputs = options.numberOfInputs || 1;
    options.numberOfOutputs = options.numberOfOutputs || 1;
    options.numberOfHiddenLayers = options.numberOfHiddenLayers || 1;
    options.numberOfNeuronsPerHiddenLayer = options.numberOfNeuronsPerHiddenLayer || 1;

    var __size    = NetworkHelper.size(options);
    var __layers  = NetworkHelper.makeLayers(options);
    var __weights = [];

    if (Array.isArray(options.weights) && options.weights.length) {
        if (options.weights.length !== __size) {
            throw new Error('Network expected an array of ' + __size + ' weights');
        }
        __weights = options.weights.slice();
    } else {
        for (var i = 0; i < __size; i++) {
            __weights.push(NetworkHelper.random());
        }
    }

    var me = {};

    //
    // Network > size
    //
    // Returns the network size
    // 
    // @return Integer
    //
    me.size = function() {
        return __size;
    };

    //
    // Network > export
    //
    // Returns network options with all weights
    // 
    // @return Object 
    //
    me.export = function() {
        return {
            numberOfInputs: options.numberOfInputs,
            numberOfOutputs: options.numberOfOutputs,
            numberOfHiddenLayers: options.numberOfHiddenLayers,
            numberOfNeuronsPerHiddenLayer: options.numberOfNeuronsPerHiddenLayer,
            weights: __weights.slice(),
        }
    };

    //
    // Network > update
    //
    // Update all network weights;
    // 
    // @param  Array : Weights array
    // @return Network 
    //
    me.update = function(weights) {
        if (!(Array.isArray(weights) && weights.length === __size)) {
            throw new Error('Network::update expected an array of ' + __size + ' weights');
        }
        __weights = weights.slice();
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
    me.run = function(input) {

        if (!(Array.isArray(input) && input.length === options.numberOfInputs)) {
            throw new Error('Network::run expected an array of ' + options.numberOfInputs);
        }

        var results = NetworkHelper.runLayerAsInput(__weights, __layers[0], input);
        for (var i = 1; i < __layers.length; i++) {
            results = NetworkHelper.runLayer(__weights, __layers[i], results);
        }
        return results;
    };

    return me;
};

//
// NetworkHelper
//
// Private namespace
//
var NetworkHelper = {};

//
// NetworkHelper > size
//
// Returns the network size from options
// 
// @param  Object : Network options
// @return Integer
//
NetworkHelper.size = function(options) {
    var size = 0;
    size += options.numberOfInputs + options.numberOfInputs;
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
// NetworkHelper > makeLayers
//
// Returns the network layers composition from options
// 
// @param  Object : Network options
// @return Array
//
NetworkHelper.makeLayers = function(options) {
    var layers  = [];
    var offset  = 0;
    var neurons = [];
    
    offset = NetworkHelper.pushLayer(layers, offset, options.numberOfInputs, 1);
    
    for (var i = 0; i < options.numberOfHiddenLayers; i++) {
        if (i === 0) {
            offset = NetworkHelper.pushLayer(
                layers,
                offset,
                options.numberOfNeuronsPerHiddenLayer,
                options.numberOfInputs
            );
        } else {
            offset = NetworkHelper.pushLayer(
                layers,
                offset,
                options.numberOfNeuronsPerHiddenLayer,
                options.numberOfNeuronsPerHiddenLayer
            );
        }
    }
    
    NetworkHelper.pushLayer(
        layers,
        offset, 
        options.numberOfOutputs,
        options.numberOfNeuronsPerHiddenLayer
    );
    
    return layers;
};

//
// NetworkHelper > pushLayer
//
// Insert a new layer
// 
// @param  Object : Network options
// @return Array
//
NetworkHelper.pushLayer = function (layers, offset, nbNeurons, nbInputsPerNeuron) {
    var layer = [];
    var from  = 0;
    var to    = 0;
    for (var i = 0; i < nbNeurons; i++) {
        from = offset;
        for (var j = 0; j < nbInputsPerNeuron; j++) {
            to   = from + nbInputsPerNeuron;
            offset = to + 1;
        }
        layer.push([from, to]);
    }
    layers.push(layer);
    return offset;
};

//
// NetworkHelper > runLayer
//
// Returns an array of neurons activation from input
// 
// @param  Array : Network weights
// @param  Array : Network layers
// @param  Array : Inputs data
// @return Array
//
NetworkHelper.runLayer = function(__weights, layer, input) {
    var results = [];
    layer.forEach(function(neuron) {
        results.push(NetworkHelper.getActivation(__weights.slice(neuron[0], neuron[1] + 1), input));
    });
    return results;
};

//
// NetworkHelper > runLayerAsInput
//
// Returns an array of neurons activation from neurons layer
// 
// @param  Array : Network weights
// @param  Array : Network layers
// @param  Array : Inputs data
// @return Array
//
NetworkHelper.runLayerAsInput = function(__weights, layer, input) {
    var results = [];
    layer.forEach(function(neuron, i) {
        results.push(NetworkHelper.getActivation(__weights.slice(neuron[0], neuron[1] + 1), [input[i]]));
    });
    return results;
};

//
// NetworkHelper > getActivation
//
// Returns a neuron activation
// 
// @param  Array : Neuron weights
// @param  Array : Inputs data
// @return Float
//
NetworkHelper.getActivation = function(weights, input) {
    var activation = weights[0]; // Bias
    for (var i = 1, imax = weights.length; i < imax; i++) {
        activation += input[i-1] * weights[i];
    }
    return 1 / (1 + Math.exp(-activation));
};

//
// NetworkHelper > random
//
// Returns a random weight
// 
// @return Float
//
NetworkHelper.random = function() {
    return Math.random() * 2 - 1;
};
