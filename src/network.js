//
// A class representing a Neural Network.
//
// @param options.inputSize    >> The number of inputs in this neural network
// @param options.hiddenSize   >> The number of neurons int the hidden layer
// @param options.outputSize   >> The number of outputs in this neural network
// @param options.layers       >> Optional, the layers used in the initial state (otherwise random)
//
//      {
//         inputSize  : 2,                 
//         hiddenSize : 3,
//         outputSize : 1,
//         layers     : [],
//      }
//
var Network = module.exports = function(__options) {

    var me = {};

    //
    // Network > configure
    //
    // Configure the network
    // 
    // @return this
    //
    this.configure = function(options) {
        
        if (options instanceof Network) {
            me = options.export();
        } else {
            options = options || {};
            me.inputSize  = options.inputSize  || me.inputSize  || 2;
            me.hiddenSize = options.hiddenSize || me.hiddenSize || Math.max(3, Math.floor(me.inputSize / 2));
            me.outputSize = options.outputSize || me.outputSize || 1;
            if (Array.isArray(options.layers)) {
                me.layers = JSON.parse(JSON.stringify(options.layers));
            } else {
                me.layers = [];
                me.layers[0] = Network.createLayer(me.inputSize, 1);
                me.layers[1] = Network.createLayer(me.hiddenSize, me.layers[0].length);
                me.layers[2] = Network.createLayer(me.outputSize, me.layers[1].length);
            }
        }

        return this;
    };

    //
    // Network > run
    //
    // Return an array of sigmoid activations
    // 
    // @param  Array : Input values
    // @return Array
    //
    this.run = function(input) {
        if (!Array.isArray(me.layers)) {
            throw new Error('Network must be initialized with options or trained');
        }
        if (!(Array.isArray(input) && input.length === me.inputSize)) {
            throw new Error('Network::run expected an array of ' + me.inputSize + ' inputs');
        }
        var outputs = [];
        for (var layerId = 1; layerId < me.layers.length; layerId++) {
            outputs = input = Network.outputLayer(me.layers[layerId], input);
        }
        return outputs;
    };

    //
    // Network > export
    //
    // Returns network options
    // 
    // @return Object 
    //
    this.export = function() {
        return JSON.parse(JSON.stringify(me, function(key,value) {
            if (key=="changes") return undefined;
            else return value;
        }));
    };

    //
    // Network > train
    //
    // Train the network with back propagation
    // 
    // @param  Array              : Training data
    // @param  options.iterations : The number of back propagation iterations
    // @param  options.learning   : Learning rate
    // @param  options.momentum   : Reduction rate
    // @param  options.treshold   : Error treshold to break iterations loop
    // @param  options.callback   : Callback function for log
    // @param  options.interval   : Callback function interval
    // @return Object
    //
    this.train = function(data, options) {

        options = options || {};
        options.iterations = options.iterations || 20000;
        options.learning   = options.learning   || 0.3;
        options.momentum   = options.momentum   || 0.1;
        options.treshold   = options.treshold   || 0.005;
        options.callback   = options.callback   || null;
        options.interval   = options.interval   || 10;

        // Init the network with training data
        if (!Array.isArray(me.layers)) {
            this.configure({
                inputSize  : data[0].input.length,
                hiddenSize : Math.max(3, Math.floor(data[0].input.length / 2)),
                outputSize : data[0].output.length,
            });
        }

        if (!(Array.isArray(data[0].input) && data[0].input.length === me.inputSize)) {
            throw new Error('Network::run expected an array of ' + me.inputSize + ' inputs');
        }

        if (!(Array.isArray(data[0].output) && data[0].output.length === me.outputSize)) {
            throw new Error('Network::run expected an array of ' + me.outputSize + ' outputs');
        }

        var gerror  = 10;

        for (var i = 0; i < options.iterations && gerror > options.treshold; i++) {

            var ierror = 0;

            for (var j = 0; j < data.length; j++) {

                var input    = data[j].input;
                var target   = data[j].output;
                var errors   = [];
                var deltas   = [];
                var outputs  = Network.getOutputs(me.layers, input);

                // Calculate errors and deltas

                for (var layerId = me.layers.length - 1; layerId >= 0; layerId--) {
                    errors[layerId] = [];
                    deltas[layerId] = [];
                    for (var neuronId = 0; neuronId < me.layers[layerId].length; neuronId++) {
                        var output = outputs[layerId][neuronId];
                        var nerror = 0;
                        if (layerId === me.layers.length - 1) {
                            nerror = target[neuronId] - output;
                        } else {
                            var d = deltas[layerId + 1];
                            for (var k = 0; k < d.length; k++) {
                                nerror += d[k] * me.layers[layerId + 1][k].weights[neuronId];
                            }
                        }
                        errors[layerId][neuronId] = nerror;
                        deltas[layerId][neuronId] = nerror * output * (1 - output);
                    }
                }

                // Back propagate
                // Store neuron changes for the next backprop

                for (var layerId = 1; layerId < me.layers.length; layerId++) {
                    var incoming = outputs[layerId - 1];
                    for (var neuronId = 0; neuronId < me.layers[layerId].length; neuronId++) {
                        var delta  = deltas[layerId][neuronId];
                        var neuron = me.layers[layerId][neuronId];
                        if (!neuron.changes) {
                            neuron.changes = Network.zeros(neuron.weights.length);
                        }
                        for (var k = 0; k < incoming.length; k++) {
                            var change = neuron.changes[k];
                            change = (options.learning * delta * incoming[k]) + (options.momentum * change);
                            neuron.changes[k]  = change;
                            neuron.weights[k] += change;
                        }
                        neuron.bias += options.learning * delta;
                    }
                }

                // Hidden layer errors sum
                ierror += Network.getErrorSum(errors[2]);
            }

            // Global errors sum
            gerror = ierror / data.length;

            if (options.callback && (i % options.interval == 0)) {
                options.callback({ error: gerror, iterations: i });
            }
        }

        return { error: gerror, iterations: i };
    };

    //
    // Network > toFunction
    //
    // Export a standalone function
    // 
    // @return Function
    //
    this.toFunction = function() {
        var layers = JSON.stringify(me.layers, function(key,value) {
            if (key=="changes") return undefined;
            else return value;
        });
        var buffer = 'var layers = ' + layers + ';';
        buffer += 'for (var i = 1; i < layers.length; i++) {';
        buffer += 'var layer = layers[i];';
        buffer += 'var output = [];';
        buffer += 'for (var j = 0; j < layer.length; j++) {';
        buffer += 'var neuron = layer[j];';
        buffer += 'var result = neuron.bias;';
        buffer += 'for (var k = 0; k < neuron.weights.length; k++) {';
        buffer += 'result += neuron.weights[k] * input[k];';
        buffer += '}';
        buffer += 'output[j] = (1 / (1 + Math.exp(-result)));';
        buffer += '}';
        buffer += 'input = output;';
        buffer += '}';
        buffer += 'return output;';
        return new Function("input", buffer);
    };

    // Configure the network if some options are given

    if (__options) {
        this.configure(__options);
    }
};

//-------------------------------------------------------------------------------------------------
// Common helpers namespace
//-------------------------------------------------------------------------------------------------


Network.random = function(size) {
    size = size || 0.4;
    return Math.random() * size - (size / 2);
};

Network.randos = function(size) {
    var results = [];
    for (var i = 0; i < size; i++) {
        results.push(Network.random());
    }
    return results;
};

Network.zeros = function(size) {
    var results = [];
    for (var i = 0; i < size; i++) {
        results.push(0);
    }
    return results;
};

Network.createLayer = function(numberOfNeurons, inputSizePerNeuron) {
    var layer = [];
    for (var i = 0; i < numberOfNeurons; i++) {
        layer[i] = {
            bias: Network.random(),
            weights: Network.randos(inputSizePerNeuron),
            changes: Network.zeros(inputSizePerNeuron),
        };
    }
    return layer;
};

Network.outputLayer = function(layer, input) {
    var results = [];
    for (var neuronId = 0; neuronId < layer.length; neuronId++) {
        var neuron = layer[neuronId];
        var result = neuron.bias;
        for (var k = 0; k < neuron.weights.length; k++) {
            result += neuron.weights[k] * input[k];
        }
        results.push(1 / (1 + Math.exp(-result)));
    }
    return results;
};

Network.getOutputs = function(layers, input) {
    var outputs = [];
    var output  = outputs[0] = input.slice();
    for (var layerId = 1; layerId < layers.length; layerId++) {
        output = outputs[layerId] = Network.outputLayer(layers[layerId], output);
    }
    return outputs;
};

Network.getErrorSum = function(errors) {
    var sum = 0;
    for (var i = 0; i < errors.length; i++) {
        sum += Math.pow(errors[i], 2);
    }
    return sum / errors.length;
};
