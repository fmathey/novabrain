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

        this.training = {
            changes: [],
            iteration: {
                errors: [],
                deltas: [],
            }
        };
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

        this.changes = [];

        var globalError = 10;
        var iterationsCount = 0;

        for (var i = 0; i < options.iterations && globalError > options.treshold; i++) {

            var iterationError = 0;

            for (var j = 0; j < data.length; j++) {
                var outputs = this.getOutputs(data[j].input);
                var target  = data[j].output;

                this.prepare(outputs, target);

                this.propagate(outputs, options.learning, options.momentum);

                // Hidden layer errors sum
                iterationError += this.getErrorSum(this.training.iteration.errors[this.lastLayerId]);
            }

            // Global errors sum
            globalError = iterationError / data.length;

            if (options.callback && (i % options.interval == 0)) {
                options.callback({ error: globalError, iterations: i });
            }

            iterationsCount++;
        }

        return {
            error: globalError,
            iterations: iterationsCount
        };
    }

    //
    // Calculate errors and deltas
    //
    prepare(outputs, target) {

        this.training.iteration.errors = [];
        this.training.iteration.deltas = [];

        for (var layerId = this.lastLayerId; layerId >= 0; layerId--) {

            this.training.iteration.errors[layerId] = [];
            this.training.iteration.deltas[layerId] = [];

            var layer = this.network.layers[layerId];

            for (var neuronId = 0; neuronId < layer.neurons.length; neuronId++) {

                var output = outputs[layerId][neuronId];
                var neuronError = 0;

                if (layerId === this.lastLayerId) {
                    neuronError = target[neuronId] - output;
                } else {
                    var delta = this.training.iteration.deltas[layerId + 1];
                    for (var k = 0; k < delta.length; k++) {
                        var weight = this.network.layers[layerId + 1].neurons[k].weights[neuronId];
                        neuronError += delta[k] * weight;
                    }
                }
                this.training.iteration.errors[layerId][neuronId] = neuronError;
                this.training.iteration.deltas[layerId][neuronId] = neuronError * output * (1 - output);
            }
        }

        return this;
    }

    //
    // Back propagate
    //
    propagate(outputs, learning, momentum) {
        if (this.training.changes.length !== this.nbLayers) {
            this.training.changes = new Array(this.nbLayers);
        }

        for (var layerId = 1; layerId < this.nbLayers; layerId++) {
            var incoming = outputs[layerId - 1];
            var layer = this.network.layers[layerId];

            if (!Array.isArray(this.training.changes[layerId])) {
                this.training.changes[layerId] = new Array(layer.neurons.length);
            }

            for (var neuronId = 0; neuronId < layer.neurons.length; neuronId++) {
                var neuron = layer.neurons[neuronId];
                var delta  = this.training.iteration.deltas[layerId][neuronId];

                if (!Array.isArray(this.training.changes[layerId][neuronId])) {
                    this.training.changes[layerId][neuronId] = new Array(neuron.weights.length);
                }

                for (var k = 0; k < incoming.length; k++) {
                    var change = this.training.changes[layerId][neuronId][k] || 0;
                    change = (learning * delta * incoming[k]) + (momentum * change);
                    neuron.weights[k] += change;
                    this.training.changes[layerId][neuronId][k] = change;
                }
                neuron.bias += learning * delta;
            }
        }

        return this;
    }

    getOutputs(inputs) {
        var outputs = [];
        var output  = outputs[0] = inputs.slice();
        for (var i = 1; i < this.network.layers.length; i++) {
            output = outputs[i] = this.network.layers[i].output(output);
        }
        return outputs;
    }

    getErrorSum(errors) {
        var sum = 0;
        errors.forEach((error) => {
            sum += Math.pow(error, 2);
        });
        return sum / errors.length;
    };
}

module.exports = Trainer;