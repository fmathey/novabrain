'use strict';

var Layer = require('./layer');
var Transfer = require('./transfer');

class Network {

    constructor() {

        this.layers = [];

        var args = Array.prototype.slice.call(arguments);

        if (args < 2) {
            throw new Error('Network expected 2 integers or more');
        }

        if (args.length === 2) {
            args.splice(1, 0, Math.max(3, Math.floor(args[0] / 2)));
        }

        this.layers.push(new Layer(args[0], 1));

        for (var i = 1; i < args.length; i++) {
            this.layers.push(new Layer(args[i], this.layers[i-1].neurons.length));
        }

        this.transfer = Transfer.LOGISTIC;
    }

    output(inputs, transfer) {
        var outputs = [];
        for (var i = 1; i < this.layers.length; i++) {
            outputs = inputs = this.layers[i].output(inputs, transfer || this.transfer);
        }
        return outputs;
    }

    export() {
        var json = [];
        for (var i = 0; i < this.layers.length; i++) {
            json.push(this.layers[i].export());
        }
        return json;
    }

    import(layers) {

        if (layers instanceof Network) {
            layers = layers.export();
        }

        if (layers.length !== this.layers.length) {
            throw new Error('Network expected [' + this.layers.length + '] layers');
        }

        for (var i = 0; i < this.layers.length; i++) {

            var neurons = this.layers[i].neurons;

            if (layers[i].length !== neurons.length) {
                throw new Error('Layer [' + i + '] expected [' + neurons.length + '] neurons');
            }

            for (var j = 0; j < neurons.length; j++) {

                var neuron = neurons[j];

                if (layers[i][j].bias === undefined) {
                    throw new Error('Neuron [' + j + '] expected a [bias] value');
                }

                neuron.bias = layers[i][j].bias;

                if (!Array.isArray(layers[i][j].weights)) {
                    throw new Error('Neuron [' + j + '] expected a [weights] array of [' + neuron.weights.length + '] values');
                }

                for (var k = 0; k < neuron.weights.length; k++) {
                    neuron.weights[k] = layers[i][j].weights[k];
                }
            }
        }
        return this;
    }

    standalone(transfer) {

        transfer = Transfer.LOGISTIC.toString();

        var layers = JSON.stringify(this.export());

        var buffer = '';

        buffer += 'transfer = transfer || ' + transfer + ';';
        buffer += 'var layers = ' + layers + ';';
        buffer += 'for (var i = 1; i < layers.length; i++) {';
        buffer += 'var layer = layers[i];';
        buffer += 'var outputs = [];';
        buffer += 'for (var j = 0; j < layer.length; j++) {';
        buffer += 'var neuron = layer[j];';
        buffer += 'var result = neuron.bias;';
        buffer += 'for (var k = 0; k < neuron.weights.length; k++) {';
        buffer += 'result += neuron.weights[k] * inputs[k];';
        buffer += '}';
        buffer += 'outputs[j] = transfer(result);';
        buffer += '}';
        buffer += 'inputs = outputs;';
        buffer += '}';
        buffer += 'return outputs;';

        return new Function("inputs", "transfer", buffer);
    }

}

module.exports = Network;