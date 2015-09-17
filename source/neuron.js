var Transfer = require('./transfer');

class Neuron {

    constructor(size) {
        this.bias = Math.random() * 0.4 - 0.2;
        this.weights = [];
        for (var i = 0; i < size; i++) {
            this.weights.push(Math.random() * 0.4 - 0.2);
        }
    }

    output(inputs, transfer) {

        if (!Array.isArray(inputs)) {
            throw new Error('Inputs array expected');
        }

        if (inputs.length !== this.weights.length) {
            throw new Error('Inputs length ' + this.weights.length + ' expected');
        }

        transfer = transfer || Transfer.LOGISTIC;

        var sum = this.bias;
        for(var i = 0, imax = this.weights.length; i < imax; i++) {
            sum += this.weights[i] * inputs[i];
        }
        return transfer(sum);
    }

    export() {
        return {
            bias: this.bias,
            weights: this.weights.slice()
        };
    }
}

module.exports = Neuron;
