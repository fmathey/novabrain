'use strict';

var Network = require('./network');

class Trainer {

    constructor(network) {

        if (!(network instanceof Network)) {
            throw new Error('Network instance expected');
        }

        this.network     = network;
        this.inputSize   = network.layers[0].neurons.length;
        this.outputSize  = network.layers[network.layers.length-1].neurons.length;
        this.nbLayers    = this.network.layers.length;
        this.lastLayerId = this.nbLayers - 1;
    }

    //
    // Trainer.train
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

        if (!(Array.isArray(data[0].input) && data[0].input.length === this.inputSize)) {
            throw new Error('Train expected an input data array of ' + this.inputSize);
        }

        if (!(Array.isArray(data[0].output) && data[0].output.length === this.outputSize)) {
            throw new Error('Train expected an output data array of ' + this.outputSize);
        }

        var timeStart = new Date().getTime();

        var result = {
            error: 10,
            iterations: 0,
            time: 0
        };

        for (var i = 0; i < options.iterations && result.error > options.treshold; i++) {

            var iterationError = 0;

            for (var j = 0; j < data.length; j++) {
                iterationError += this.trainPattern(
                    data[j].input,
                    data[j].output,
                    options.learning,
                    options.momentum
                );
            }

            result.error = iterationError / data.length;

            if (options.callback && (i % options.interval == 0)) {
                options.callback(result);
            }

            result.iterations++;

            result.time = (new Date().getTime()) - timeStart;
        }

        return result;
    }

    trainPattern(input, target, learning, momentum) {

        learning = learning || 0.3;
        momentum = momentum || 0.1;

        var outputs = this.getOutputs(input);

        // Calculate errors and deltas

        for (var layerId = this.lastLayerId; layerId >= 0; layerId--) {
            var neurons = this.network.layers[layerId].neurons;
            for (var neuronId = 0; neuronId < neurons.length; neuronId++) {
                var output = outputs[layerId][neuronId];
                var neuronError = 0;
                if (layerId === this.lastLayerId) {
                    neuronError = target[neuronId] - output;
                } else {
                    var nextLayerNeurons = this.network.layers[layerId + 1].neurons;
                    for (var k = 0; k < nextLayerNeurons.length; k++) {
                        neuronError += nextLayerNeurons[k].delta * nextLayerNeurons[k].weights[neuronId];
                    }
                }
                neurons[neuronId].error = neuronError;
                neurons[neuronId].delta = neuronError * output * (1 - output);
            }
        }

        // Back propagate

        for (var layerId = 1; layerId < this.nbLayers; layerId++) {
            var incoming = outputs[layerId - 1];
            var neurons = this.network.layers[layerId].neurons;
            for (var neuronId = 0; neuronId < neurons.length; neuronId++) {
                var neuron = neurons[neuronId];
                var delta  = neuron.delta;
                for (var k = 0; k < incoming.length; k++) {
                    var change = neuron.changes[k];
                    change = (learning * delta * incoming[k]) + (momentum * change);
                    neuron.weights[k] += change;
                    neuron.changes[k] = change;
                }
                neuron.bias += learning * delta;
            }
        }

        var errors = [];

        var neurons = this.network.layers[this.lastLayerId].neurons;

        for(var i = 0; i < neurons.length; i++) {
            errors.push(neurons[i].error);
        }

        return this.getErrorSum(errors);
    }

    getOutputs(inputs) {
        var outputs = [];
        var output  = outputs[0] = inputs.slice();
        var layers = this.network.layers;
        for (var i = 1; i < layers.length; i++) {
            output = outputs[i] = layers[i].output(output);
        }
        return outputs;
    }

    getErrorSum(errors) {
        var sum = 0;
        for (var i = 0; i < errors.length; i++) {
            sum += Math.pow(errors[i], 2);
        }
        return sum / errors.length;
    };

}

module.exports = Trainer;