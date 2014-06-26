
var Network = require('./network');

var NetworkGenetic = module.exports = function(options) {

    var self = this;

    options = options || {};

    Network.call(this, options);

    this.populationSize = options.populationSize || 400;
    this.maxIterations  = options.maxIterations  || 1000;
    this.mutationRate   = options.mutationRate   || 0.9;
    this.maxPerbutation = options.maxPerbutation || 0.6;
    this.survivalRate   = options.survivalRate   || 0.3;
    this.errorThreshold = options.errorThreshold || 0.005;
    this.floodCallback  = options.floodCallback  || null;
};

//
// Inherit of Network
//
NetworkGenetic.prototype = Object.create(Network.prototype);

//
// GeneticTrainer > train
//
// Returns an array of sigmoid values
// 
// @param  Network
// @param  Array :training data
// @return Object
//
NetworkGenetic.prototype.train = function(training) {

    if (!(Array.isArray(training) && training.length > 0)) {
        throw new Error('NetworkGenetic::train expected a training array');
    }

    var networks = [];

    for (var i = 0; i < this.populationSize; i++) {
        networks.push(new Network(this));
    }

    var iteration = 0;

    for(var i = 0; i < this.maxIterations; i++) {
        for (var j = 0, jmax = networks.length; j < jmax; j++) {

            var error = 0;
            for (var k = 0; k < training.length; k++) {
                var results = networks[j].run(training[k].input);
                error += NetworkGenetic.helpers.getErrorRate(results, training[k].output);
            };

            networks[j].__fitness = error;

            if (this.floodCallback && typeof this.floodCallback === 'function') {
                this.floodCallback({
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
        networks = NetworkGenetic.helpers.makeNewGeneration(networks, this);
        iteration++;
    }

    this.update(networks[0].weights);

    return {
        iteration: iteration,
        fitness: networks[0].__fitness,
    };
};

//
// NetworkGenetic helpers namespace
//
NetworkGenetic.helpers = Network.helpers;

//
// NetworkGenetic > helper > getErrorRate
//
// Returns errors sum
// 
// @param  Array
// @param  Array
// @return Float
//
NetworkGenetic.helpers.getErrorRate = function (a, b) {
    var sumError = 0;
    for (var i = a.length - 1; i >= 0; i--) {
        sumError += Math.abs(a[i] - b[i]);
    };
    return sumError;
};

//
// NetworkGenetic > helper > mergeWeights
//
// Returns merged weights
// 
// @param  Array : Weights list
// @param  Array : Weights list
// @return Array : All weights
//
NetworkGenetic.helpers.mergeWeights = function(a, b) {
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
// NetworkGenetic > helper > mutateWeights
//
// Returns mutated weights
// 
// @param  Array  : Weights to mutate
// @param  Object : Trainer options
// @return Array  : Mutated weights
//
NetworkGenetic.helpers.mutateWeights = function(weights, options) {
    var mutated = [];
    weights.forEach(function(weight) {
        if(Math.random() < options.mutationRate) {
            mutated.push(weight + (NetworkGenetic.helpers.getRandomWeight() * options.maxPerbutation));
        } else {
            mutated.push(weight);
        }
    });
    return mutated;
};

//
// NetworkGenetic > helper > mutateWeights
//
// Returns mutated weights
// 
// @param  Array  : List of Networks
// @param  Object : Trainer options
// @return Array  : List of new generation Networks
//
NetworkGenetic.helpers.makeNewGeneration = function (networks, options) {

    networks.sort(function(a, b) { return a.__fitness - b.__fitness; });

    var count = networks.length;
    var kills = Math.floor(options.survivalRate * count);

    networks.splice(kills);

    for(var i = 0; i < count - kills; i++) {
        var optionsA = networks[Math.floor(Math.random() * kills)];
        var optionsB = networks[Math.floor(Math.random() * kills)];
        var optionsC = optionsA.export();
        var combined = NetworkGenetic.helpers.mergeWeights(optionsA.weights, optionsB.weights);
        optionsC.weights = NetworkGenetic.helpers.mutateWeights(combined, options);
        networks.push(new Network(optionsC));
    }

    return networks;
};
