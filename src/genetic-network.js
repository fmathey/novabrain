
var BaseNetwork = require('./base-network');

var GeneticNetwork = module.exports = function(options) {

    var self = this;

    options = options || {};

    BaseNetwork.call(this, options);

    this.populationSize = options.populationSize || 400;
    this.maxIterations  = options.maxIterations  || 1000;
    this.mutationRate   = options.mutationRate   || 0.9;
    this.maxPerbutation = options.maxPerbutation || 0.6;
    this.survivalRate   = options.survivalRate   || 0.3;
    this.errorThreshold = options.errorThreshold || 0.005;
};

//
// Inherit of BaseNetwork
//
GeneticNetwork.prototype = Object.create(BaseNetwork.prototype);

//
// GeneticTrainer > train
//
// Returns an array of sigmoid values
// 
// @param  BaseNetwork
// @param  Array :training data
// @return Object
//
GeneticNetwork.prototype.train = function(training, floodCallback) {

    if (!(Array.isArray(training) && training.length > 0)) {
        throw new Error('GeneticNetwork::train expected a training array');
    }

    var networks = [];

    for (var i = 0; i < this.populationSize; i++) {
        networks.push(new BaseNetwork(this));
    }

    var iteration = 0;

    for(var i = 0; i < this.maxIterations; i++) {
        for (var j = 0, jmax = networks.length; j < jmax; j++) {

            var error = 0;
            for (var k = 0; k < training.length; k++) {
                var results = networks[j].run(training[k].input);
                error += GeneticNetwork.helper.getErrorRate(results, training[k].output);
            };

            networks[j].__fitness = error;

            if (floodCallback && typeof floodCallback === 'function') {
                floodCallback({
                    iteration: iteration,
                    fitness: networks[j].__fitness,
                });
            }

            if (error <= this.errorThreshold) {
                this.update(networks[0].weights);
                return {
                    iteration: iteration,
                    fitness: networks[0].__fitness,
                }
            }
        };
        networks = GeneticNetwork.helper.makeNewGeneration(networks, this);
        iteration++;
    }

    this.update(networks[0].weights);

    return {
        iteration: iteration,
        fitness: networks[0].__fitness,
    };
};

//
// GeneticNetwork > export
//
// Returns network options with all weights
// 
// @return Object 
//
GeneticNetwork.prototype.export = function() {
    return {
        numberOfInputs: this.numberOfInputs,
        numberOfOutputs: this.numberOfOutputs,
        numberOfHiddenLayers: this.numberOfHiddenLayers,
        numberOfNeuronsPerHiddenLayer: this.numberOfNeuronsPerHiddenLayer,
        populationSize: this.populationSize,
        maxIterations: this.maxIterations,
        mutationRate: this.mutationRate,
        maxPerbutation: this.maxPerbutation,
        survivalRate: this.survivalRate,
        errorThreshold: this.errorThreshold,
        weights: this.weights.slice(),
    };
};

//
// GeneticNetwork helper namespace inherits from BaseNetwork.helper
//
GeneticNetwork.helper = BaseNetwork.helper;

//
// GeneticNetwork > helper > getErrorRate
//
// Returns errors sum
// 
// @param  Array
// @param  Array
// @return Float
//
GeneticNetwork.helper.getErrorRate = function (a, b) {
    var sumError = 0;
    for (var i = a.length - 1; i >= 0; i--) {
        sumError += Math.abs(a[i] - b[i]);
    };
    return sumError;
};

//
// GeneticNetwork > helper > mergeWeights
//
// Returns merged weights
// 
// @param  Array : Weights list
// @param  Array : Weights list
// @return Array : All weights
//
GeneticNetwork.helper.mergeWeights = function(a, b) {
    var result = [];
    var aLength = Math.ceil(a.length / 2);
    var bLength = Math.floor(b.length / 2);
    for(var i = 0; i < aLength; i++){
        result.push(a[i]);
    }
    for(var i = 0; i <bLength; i++) {
        result.push(b[aLength + i]);
    }
    return result;
};

//
// GeneticNetwork > helper > mutateWeights
//
// Returns mutated weights
// 
// @param  Array  : Weights to mutate
// @param  Object : Trainer options
// @return Array  : Mutated weights
//
GeneticNetwork.helper.mutateWeights = function(weights, options) {
    var mutated = [];
    weights.forEach(function(weight) {
        if(Math.random() < options.mutationRate) {
            mutated.push(weight + (GeneticNetwork.helper.getRandomWeight() * options.maxPerbutation));
        } else {
            mutated.push(weight);
        }
    });
    return mutated;
};

//
// GeneticNetwork > helper > mutateWeights
//
// Returns mutated weights
// 
// @param  Array  : List of Networks
// @param  Object : Trainer options
// @return Array  : List of new generation Networks
//
GeneticNetwork.helper.makeNewGeneration = function (networks, options) {

    networks.sort(function(a, b) { return a.__fitness - b.__fitness; });

    var count = networks.length;
    var kills = Math.floor(options.survivalRate * count);

    networks.splice(kills);

    for(var i = 0; i < count - kills; i++) {
        var optionsA = networks[Math.floor(Math.random() * kills)];
        var optionsB = networks[Math.floor(Math.random() * kills)];
        var optionsC = optionsA.export();
        var combined = GeneticNetwork.helper.mergeWeights(optionsA.weights, optionsB.weights);
        optionsC.weights = GeneticNetwork.helper.mutateWeights(combined, options);
        networks.push(new BaseNetwork(optionsC));
    }

    return networks;
};
