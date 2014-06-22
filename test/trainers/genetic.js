
var assert  = require('assert');
var Network = require('./../../lib/network');
var Trainer = require('./../../lib/trainers/genetic');

describe('Genetic Trainer', function(){

    describe('#train', function(){

        it('should resolve XOR', function(){
            var networkOptions = {
                numberOfInputs: 2,
                numberOfOutputs: 1,
                numberOfHiddenLayers: 2,
                numberOfNeuronsPerHiddenLayer: 5,
            };

            var trainerOptions = {
                populationSize : 400,
                maxIterations  : 2000,
                mutationRate   : 0.8,
                survivalRate   : 0.3,
                maxPerbutation : 0.9,
            };

            var network  = new Network(networkOptions);
            var trainer  = new Trainer(trainerOptions);

            var training = [ 
                { input: [0,0], output: [0] },
                { input: [0,1], output: [1] },
                { input: [1,0], output: [1] },
                { input: [1,1], output: [0] },
            ];

            trainer.train(network, training);

            assert.strictEqual(Math.round(network.run([0,0]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([0,1]) * 1) / 1, 1);
            assert.strictEqual(Math.round(network.run([1,0]) * 1) / 1, 1);
            assert.strictEqual(Math.round(network.run([1,1]) * 1) / 1, 0);
        });

        it('should resolve AND', function(){
            var networkOptions = {
                numberOfInputs: 2,
                numberOfOutputs: 1,
                numberOfHiddenLayers: 2,
                numberOfNeuronsPerHiddenLayer: 5,
            };

            var trainerOptions = {
                populationSize : 400,
                maxIterations  : 2000,
                mutationRate   : 0.8,
                survivalRate   : 0.3,
                maxPerbutation : 0.9,
            };

            var network  = new Network(networkOptions);
            var trainer  = new Trainer(trainerOptions);

            var training = [ 
                { input: [0,0], output: [0] },
                { input: [0,1], output: [0] },
                { input: [1,0], output: [0] },
                { input: [1,1], output: [1] },
            ];

            trainer.train(network, training);

            assert.strictEqual(Math.round(network.run([0,0]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([0,1]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([1,0]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([1,1]) * 1) / 1, 1);
        });

        it('should resolve OR', function(){
            var networkOptions = {
                numberOfInputs: 2,
                numberOfOutputs: 1,
                numberOfHiddenLayers: 2,
                numberOfNeuronsPerHiddenLayer: 5,
            };

            var trainerOptions = {
                populationSize : 400,
                maxIterations  : 2000,
                mutationRate   : 0.8,
                survivalRate   : 0.3,
                maxPerbutation : 0.9,
            };

            var network  = new Network(networkOptions);
            var trainer  = new Trainer(trainerOptions);

            var training = [ 
                { input: [0,0], output: [0] },
                { input: [0,1], output: [1] },
                { input: [1,0], output: [1] },
                { input: [1,1], output: [1] },
            ];

            trainer.train(network, training);

            assert.strictEqual(Math.round(network.run([0,0]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([0,1]) * 1) / 1, 1);
            assert.strictEqual(Math.round(network.run([1,0]) * 1) / 1, 1);
            assert.strictEqual(Math.round(network.run([1,1]) * 1) / 1, 1);
        });

        it('should resolve custom training', function(){
            var networkOptions = {
                numberOfInputs: 4,
                numberOfOutputs: 1,
                numberOfHiddenLayers: 1,
                numberOfNeuronsPerHiddenLayer: 1,
            };

            var trainerOptions = {
                populationSize : 200,
                maxIterations  : 20000,
                mutationRate   : 0.3,
                survivalRate   : 0.3,
                maxPerbutation : 0.3,
                thresholdError : 0.015,
            };

            var network  = new Network(networkOptions);
            var trainer  = new Trainer(trainerOptions);
            var inputs   = [ 0.5099887, 0.4566693, 0.3764133, 0.2705677 ];
            var expected = 0.19;

            var training = [ 
                { input: [ 0.1793975, 0.3202226, 0.4244039, 0.4937737 ], output: [ 0.5300726 ] },
                { input: [ 0.3202226, 0.4244039, 0.4937737, 0.5300726 ], output: [ 0.5349539 ] },
                { input: [ 0.4244039, 0.4937737, 0.5300726, 0.5349539 ], output: [ 0.5099887 ] },
                { input: [ 0.4937737, 0.5300726, 0.5349539, 0.5099887 ], output: [ 0.4566693 ] },
                { input: [ 0.5300726, 0.5349539, 0.5099887, 0.4566693 ], output: [ 0.3764133 ] },
                { input: [ 0.5349539, 0.5099887, 0.4566693, 0.3764133 ], output: [ 0.2705677 ] },
            ];

            trainer.train(network, training);

            assert.ok(network.run(inputs) > 0.15); // 0.19
            assert.ok(network.run(inputs) < 0.22); // 0.19
        });

    });

});
