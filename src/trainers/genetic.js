
var Network = require('./../network');

//
// GeneticTrainer
//
// Train a network with Genetic Algorithm
//
// @param object options
//
var GeneticTrainer = module.exports = function(options) {
    this.options = options || {};
    this.options.populationSize = options.populationSize || 100;
    this.options.maxIterations  = options.maxIterations || 5000;
    this.options.mutationRate   = options.mutationRate || 0.3;
    this.options.maxPerbutation = options.maxPerbutation || 0.3;
    this.options.survivalRate   = options.survivalRate || 0.3;
    this.options.thresholdError = options.thresholdError || 0.015;
};

//
// GeneticTrainer > train
//
// Returns an array of sigmoid values
// 
// @param  Network
// @param  Array :training data
// @return Object
//
GeneticTrainer.prototype.train = function(network, training) {

    if (!(Array.isArray(training) && training.length > 0)) {
        throw new Error('GeneticTrainer::train expected a training array');
    }

    var networks = [];
    var networkOptions = network.export();

    for (var i = 0; i < this.options.populationSize; i++) {
        networks.push(new Network(networkOptions));
    }

    var iteration = 0;

    for(var i = 0; i < this.options.maxIterations; i++) {
        for (var j = 0, jmax = networks.length; j < jmax; j++) {
            var error = 0;
            training.forEach(function(data) {
                var results = networks[j].run(data.input);
                error += GeneticTrainerHelper.getErrorRate(results, data.output);
            });

            networks[j].__fitness = error;
            if (error <= this.options.thresholdError) {
                network.update(networks[0].export().weights);
                return {
                    iteration: iteration,
                    fitness: networks[0].__fitness,
                }
            }
        };
        networks = GeneticTrainerHelper.makeNewGeneration(networks, this.options);
        iteration++;
    }

    network.update(networks[0].export().weights);

    return {
        iteration: iteration,
        fitness: networks[0].__fitness,
    };
};

//
// GeneticTrainerHelper
//
// Not exported.
//
var GeneticTrainerHelper = {};

//
// GeneticTrainerHelper > getErrorRate
//
// Returns errors sum
// 
// @param  Array
// @param  Array
// @return Float
//
GeneticTrainerHelper.getErrorRate = function (a, b) {
    var sumError = 0;
    for (var i = a.length - 1; i >= 0; i--) {
        sumError += Math.abs(a[i] - b[i]);
    };
    return sumError;
};

//
// GeneticTrainerHelper > mergeWeights
//
// Returns merged weights
// 
// @param  Array : Weights list
// @param  Array : Weights list
// @return Array : All weights
//
GeneticTrainerHelper.mergeWeights = function(a, b) {
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
// GeneticTrainerHelper > mutateWeights
//
// Returns mutated weights
// 
// @param  Array  : Weights to mutate
// @param  Object : Trainer options
// @return Array  : Mutated weights
//
GeneticTrainerHelper.mutateWeights = function(weights, options) {
    var mutated = [];
    weights.forEach(function(weight) {
        if(Math.random() < options.mutationRate) {
            mutated.push(weight + ((Math.random() * 2 - 1) * options.maxPerbutation));
        } else {
            mutated.push(weight);
        }
    });
    return mutated;
};

//
// GeneticTrainerHelper > mutateWeights
//
// Returns mutated weights
// 
// @param  Array  : List of Networks
// @param  Object : Trainer options
// @return Array  : List of new generation Networks
//
GeneticTrainerHelper.makeNewGeneration = function (networks, options) {

    networks.sort(function(a, b) { return a.__fitness - b.__fitness; });

    var count = networks.length;
    var kills = Math.floor(options.survivalRate * count);

    networks.splice(kills);

    for(var i = 0; i < count - kills; i++) {
        var optionsA = networks[Math.floor(Math.random() * kills)].export();
        var optionsB = networks[Math.floor(Math.random() * kills)].export();
        var optionsC = optionsA;
        var combined = GeneticTrainerHelper.mergeWeights(optionsA.weights, optionsB.weights);
        optionsC.weights = GeneticTrainerHelper.mutateWeights(combined, options);
        networks.push(new Network(optionsC));
    }

    return networks;
};
