var NetworkHelper = {};

NetworkHelper.random = function(size) {
    size = size || 0.4;
    return Math.random() * size - (size / 2);
};

NetworkHelper.randos = function(size) {
    var results = [];
    for (var i = 0; i < size; i++) {
        results.push(NetworkHelper.random());
    }
    return results;
};

NetworkHelper.zeros = function(size) {
    var results = [];
    for (var i = 0; i < size; i++) {
        results.push(0);
    }
    return results;
};

NetworkHelper.createLayer = function(numberOfNeurons, inputSizePerNeuron) {
    var layer = [];
    for (var i = 0; i < numberOfNeurons; i++) {
        layer[i] = {
            bias: NetworkHelper.random(),
            weights: NetworkHelper.randos(inputSizePerNeuron),
            changes: NetworkHelper.zeros(inputSizePerNeuron),
        };
    }
    return layer;
};

NetworkHelper.outputLayer = function(layer, input) {
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

NetworkHelper.getOutputs = function(layers, input) {
    var outputs = [];
    var output  = outputs[0] = input.slice();
    for (var layerId = 1; layerId < layers.length; layerId++) {
        output = outputs[layerId] = NetworkHelper.outputLayer(layers[layerId], output);
    }
    return outputs;
};

NetworkHelper.getErrorSum = function(errors) {
    var sum = 0;
    for (var i = 0; i < errors.length; i++) {
        sum += Math.pow(errors[i], 2);
    }
    return sum / errors.length;
};

module.exports = NetworkHelper;