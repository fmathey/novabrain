'use strict';

var Neuron = require('./neuron');

class Layer {

    constructor(numberOfNeurons, sizeOfNeurons) {
        this.neurons = [];
        for (var i = 0; i < numberOfNeurons; i++) {
            this.neurons.push(new Neuron(sizeOfNeurons));
        }
    }

    output(inputs, transfer) {
        var results = [];
        this.neurons.forEach((neuron) => {
            results.push(neuron.output(inputs, transfer));
        });
        return results;
    }

    export() {
        var json = [];
        this.neurons.forEach((neuron) => {
            json.push(neuron.export());
        });
        return json;
    }

}

module.exports = Layer;