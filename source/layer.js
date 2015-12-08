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
        for (var i = 0; i < this.neurons.length; i++) {
            results.push(this.neurons[i].output(inputs, transfer));
        }
        return results;
    }

    export() {
        var json = [];
        for (var i = 0; i < this.neurons.length; i++) {
            json.push(this.neurons[i].export());
        }
        return json;
    }

}

module.exports = Layer;