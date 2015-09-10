var NetworkHelper = require('./NetworkHelper.js');

//
// A class representing a Neural Network.
//
// @param options.inputSize    >> The number of inputs in this neural network
// @param options.outputSize   >> The number of outputs in this neural network
// @param options.hiddenSize   >> The number of neurons by hidden layer
// @param options.layers       >> Optional, the layers used in the initial state (otherwise random)
//
//      {
//         inputSize  : 2,                 
//         outputSize : 1,
//         hiddenSize : 3,
//         layers     : [],
//      }
//
class Network {
    
    constructor(options) {
        this.configure(options);
    }

    //
    // Network > configure
    //
    // Configure the network
    // 
    // @return this
    //
    configure(options) {

        options = options || {};
        
        if (options instanceof Network) {
            options = options.toJSON();
        }

        this.inputSize  = options.inputSize  || this.inputSize  || 2;
        this.hiddenSize = options.hiddenSize || this.hiddenSize || Math.max(3, Math.floor(this.inputSize / 2));
        this.outputSize = options.outputSize || this.outputSize || 1;

        if (Array.isArray(options.layers)) {
            this.layers = JSON.parse(JSON.stringify(options.layers));
        } else {
            this.layers = [];
            this.layers[0] = NetworkHelper.createLayer(this.inputSize, 1);
            this.layers[1] = NetworkHelper.createLayer(this.hiddenSize, this.layers[0].length);
            this.layers[2] = NetworkHelper.createLayer(this.outputSize, this.layers[1].length);
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
    run(input) {
        if (!Array.isArray(this.layers)) {
            throw new Error('Network must be initialized with options or trained');
        }
        if (!(Array.isArray(input) && input.length === this.inputSize)) {
            throw new Error('Network::run expected an array of ' + this.inputSize + ' inputs');
        }
        var outputs = [];
        for (var layerId = 1; layerId < this.layers.length; layerId++) {
            outputs = input = NetworkHelper.outputLayer(this.layers[layerId], input);
        }
        return outputs;
    }

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
    train(data, options) {

        options = options || {};
        options.iterations = options.iterations || 20000;
        options.learning   = options.learning   || 0.3;
        options.momentum   = options.momentum   || 0.1;
        options.treshold   = options.treshold   || 0.005;
        options.callback   = options.callback   || null;
        options.interval   = options.interval   || 10;

        // Init the network with training data
        if (Array.isArray(this.layers)) {
            this.configure({
                inputSize  : data[0].input.length,
                hiddenSize : Math.max(3, Math.floor(data[0].input.length / 2)),
                outputSize : data[0].output.length,
            });
        }

        if (!(Array.isArray(data[0].input) && data[0].input.length === this.inputSize)) {
            throw new Error('Network::run expected an array of ' + this.inputSize + ' inputs');
        }

        if (!(Array.isArray(data[0].output) && data[0].output.length === this.outputSize)) {
            throw new Error('Network::run expected an array of ' + this.outputSize + ' outputs');
        }

        var gerror  = 10;

        for (var i = 0; i < options.iterations && gerror > options.treshold; i++) {

            var ierror = 0;

            for (var j = 0; j < data.length; j++) {

                var input    = data[j].input;
                var target   = data[j].output;
                var errors   = [];
                var deltas   = [];
                var outputs  = NetworkHelper.getOutputs(this.layers, input);

                // Calculate errors and deltas

                for (var layerId = this.layers.length - 1; layerId >= 0; layerId--) {
                    errors[layerId] = [];
                    deltas[layerId] = [];
                    for (var neuronId = 0; neuronId < this.layers[layerId].length; neuronId++) {
                        var output = outputs[layerId][neuronId];
                        var nerror = 0;
                        if (layerId === this.layers.length - 1) {
                            nerror = target[neuronId] - output;
                        } else {
                            var d = deltas[layerId + 1];
                            for (var k = 0; k < d.length; k++) {
                                nerror += d[k] * this.layers[layerId + 1][k].weights[neuronId];
                            }
                        }
                        errors[layerId][neuronId] = nerror;
                        deltas[layerId][neuronId] = nerror * output * (1 - output);
                    }
                }

                // Back propagate
                // Store neuron changes for the next backprop

                for (var layerId = 1; layerId < this.layers.length; layerId++) {
                    var incoming = outputs[layerId - 1];
                    for (var neuronId = 0; neuronId < this.layers[layerId].length; neuronId++) {
                        var delta  = deltas[layerId][neuronId];
                        var neuron = this.layers[layerId][neuronId];
                        if (!neuron.changes) {
                            neuron.changes = NetworkHelper.zeros(neuron.weights.length);
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
                ierror += NetworkHelper.getErrorSum(errors[2]);
            }

            // Global errors sum
            gerror = ierror / data.length;

            if (options.callback && (i % options.interval == 0)) {
                options.callback({ error: gerror, iterations: i });
            }
        }

        return { error: gerror, iterations: i };
    }

    //
    // Network > toJSON
    //
    // Return network options
    //
    // @return Object
    //
    toJSON() {
        var hiddenParams = ['changes'];
        return JSON.parse(JSON.stringify(Object.assign({}, this), function(key, value) {
            if (hiddenParams.indexOf(key) > -1) {
                return undefined;
            }
            return value;
        }));
    }

    //
    // Network > toFunction
    //
    // Export a standalone function
    // 
    // @return Function
    //
    toFunction() {

        var layers = JSON.stringify(this.layers, function(key,value) {
            if (key=="changes") return undefined;
            else return value;
        });

        var buffer = '';

        buffer += 'var layers = ' + layers + ';';
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
    }
}

module.exports = Network;