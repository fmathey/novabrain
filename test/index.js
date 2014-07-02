

var assert = require('assert');
var Network = require('./../src/network');

describe('Network', function(){

    describe('#construct', function(){

        it('should throw an exception if the input param is not an array', function() {
            var network = new Network();
            assert.throws(function() { network.run([0,0]); }, Error);
        });

    });

    describe('#run', function(){

        it('should throw an exception if the input param is not an array', function() {
            var network = new Network();
            assert.throws(function() { network.run(); }, Error);
            assert.throws(function() { network.run({}); }, Error);
            assert.throws(function() { network.run(0); }, Error);
            assert.throws(function() { network.run(1); }, Error);
            assert.throws(function() { network.run(2); }, Error);
            assert.throws(function() { network.run('foo'); }, Error);
        });

        it('should throw an exception if the input array length is different of the neuron inputs number', function() {
            var network = new Network({ numberOfInputs: 1 });
            assert.throws(function() { network.run([]); }, Error);
            assert.throws(function() { network.run([1,2]); }, Error);
            assert.throws(function() { network.run([1,2,3]); }, Error);
            assert.throws(function() { network.run([1,2,3,4]); }, Error);
            assert.throws(function() { network.run([1,2,3,4,5]); }, Error);
            network = new Network({ numberOfInputs: 2 });
            assert.throws(function() { network.run([]); }, Error);
            assert.throws(function() { network.run([1]); }, Error);
            assert.throws(function() { network.run([1,2,3]); }, Error);
            assert.throws(function() { network.run([1,2,3,4]); }, Error);
            assert.throws(function() { network.run([1,2,3,4,5]); }, Error);
            network = new Network({ numberOfInputs: 3 });
            assert.throws(function() { network.run([]); }, Error);
            assert.throws(function() { network.run([1]); }, Error);
            assert.throws(function() { network.run([1,2]); }, Error);
            assert.throws(function() { network.run([1,2,3,4]); }, Error);
            assert.throws(function() { network.run([1,2,3,4,5]); }, Error);
            network = new Network({ numberOfInputs: 4 });
            assert.throws(function() { network.run([]); }, Error);
            assert.throws(function() { network.run([1]); }, Error);
            assert.throws(function() { network.run([1,2]); }, Error);
            assert.throws(function() { network.run([1,2,3]); }, Error);
            assert.throws(function() { network.run([1,2,3,4,5]); }, Error);
            network = new Network({ numberOfInputs: 5 });
            assert.throws(function() { network.run([]); }, Error);
            assert.throws(function() { network.run([1]); }, Error);
            assert.throws(function() { network.run([1,2]); }, Error);
            assert.throws(function() { network.run([1,2,3]); }, Error);
            assert.throws(function() { network.run([1,2,3,4]); }, Error);
        });

        it('should return an Array of 1 value between 0 and 1', function() {
            var network = new Network({});
            var results = network.run([1,2]);
            assert.ok(results instanceof Array);
            assert.ok(results.length === 1);
            results.forEach(function(result) {
                assert.ok(result >= 0 && result <= 1);
            });
        });

        it('should return an Array of 3 value between 0 and 1', function() {
            var network = new Network({
                numberOfOutputs: 3,
            });
            var results = network.run([1,2]);
            assert.ok(results instanceof Array);
            assert.ok(results.length === 3);
            results.forEach(function(result) {
                assert.ok(result >= 0 && result <= 1);
            });
        });

        it('should return an Array of 5 value between 0 and 1', function() {
            var network = new Network({
                numberOfInputs: 3,
                numberOfOutputs: 5,
            });
            var results = network.run([1,2,3]);
            assert.ok(results instanceof Array);
            assert.ok(results.length === 5);
            results.forEach(function(result) {
                assert.ok(result >= 0 && result <= 1);
            });
        });

    });

    describe('#export', function() {

        it('should return an options object', function() {
            var options = {
                "numberOfInputs": 2,
                "numberOfOutputs": 1,
                "numberOfHiddenLayers": 1,
                "numberOfNeuronsPerHiddenLayers": 3,
                "backprop": {
                    "iterations": 20000,
                    "learningRate": 0.3,
                    "momentum": 0.1,
                    "errorThreshold": 0.005
                },
                "layers": [
                    [
                        {
                            "bias": -0.09661294342949987,
                            "weights": [
                                -0.11975311525166035
                            ]
                        },
                        {
                            "bias": 0.17311697592958808,
                            "weights": [
                                0.1510948073118925
                            ]
                        }
                    ],
                    [
                        {
                            "bias": -0.1658152960240841,
                            "weights": [
                                -0.15972283948212862,
                                -0.05795310437679291
                            ]
                        },
                        {
                            "bias": 0.17576630515977743,
                            "weights": [
                                -0.1720766675658524,
                                -0.1821492242626846
                            ]
                        },
                        {
                            "bias": 0.06921933246776463,
                            "weights": [
                                -0.16638044798746707,
                                0.04037412544712424
                            ]
                        }
                    ],
                    [
                        {
                            "bias": 0.1821145247668028,
                            "weights": [
                                0.1902920976281166,
                                0.02364055216312408,
                                -0.016087725944817055
                            ]
                        }
                    ]
                ]
            };

            var network = new Network(options);

            assert.deepEqual(options, network.export());
        });

    });

    describe('#train', function(){

        it('should resolve XOR', function(){
  
            var network = new Network();

            network.train([ 
                { input: [0,0], output: [0] },
                { input: [0,1], output: [1] },
                { input: [1,0], output: [1] },
                { input: [1,1], output: [0] },
            ]);

            assert.strictEqual(Math.round(network.run([0,0]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([0,1]) * 1) / 1, 1);
            assert.strictEqual(Math.round(network.run([1,0]) * 1) / 1, 1);
            assert.strictEqual(Math.round(network.run([1,1]) * 1) / 1, 0);
        });

        it('should resolve AND', function(){
     
            var network = new Network();

            network.train([ 
                { input: [0,0], output: [0] },
                { input: [0,1], output: [0] },
                { input: [1,0], output: [0] },
                { input: [1,1], output: [1] },
            ]);

            assert.strictEqual(Math.round(network.run([0,0]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([0,1]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([1,0]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([1,1]) * 1) / 1, 1);
        });

        it('should resolve OR', function(){

            var network = new Network();

            network.train([ 
                { input: [0,0], output: [0] },
                { input: [0,1], output: [1] },
                { input: [1,0], output: [1] },
                { input: [1,1], output: [1] },
            ]);

            assert.strictEqual(Math.round(network.run([0,0]) * 1) / 1, 0);
            assert.strictEqual(Math.round(network.run([0,1]) * 1) / 1, 1);
            assert.strictEqual(Math.round(network.run([1,0]) * 1) / 1, 1);
            assert.strictEqual(Math.round(network.run([1,1]) * 1) / 1, 1);
        });

        it('should resolve custom training', function(){

            var network  = new Network();
            var inputs   = [ 0.5099887, 0.4566693, 0.3764133, 0.2705677 ];

            network.train([ 
                { input: [ 0.1793975, 0.3202226, 0.4244039, 0.4937737 ], output: [ 0.5300726 ] },
                { input: [ 0.3202226, 0.4244039, 0.4937737, 0.5300726 ], output: [ 0.5349539 ] },
                { input: [ 0.4244039, 0.4937737, 0.5300726, 0.5349539 ], output: [ 0.5099887 ] },
                { input: [ 0.4937737, 0.5300726, 0.5349539, 0.5099887 ], output: [ 0.4566693 ] },
                { input: [ 0.5300726, 0.5349539, 0.5099887, 0.4566693 ], output: [ 0.3764133 ] },
                { input: [ 0.5349539, 0.5099887, 0.4566693, 0.3764133 ], output: [ 0.2705677 ] },
            ]);

            assert.ok(network.run(inputs) > 0.37);
            assert.ok(network.run(inputs) < 0.42);
        });

    });

});
