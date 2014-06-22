

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
            var network = new Network({ inputSize: 1 });
            assert.throws(function() { network.run([]); }, Error);
            assert.throws(function() { network.run([1,2]); }, Error);
            assert.throws(function() { network.run([1,2,3]); }, Error);
            assert.throws(function() { network.run([1,2,3,4]); }, Error);
            assert.throws(function() { network.run([1,2,3,4,5]); }, Error);
            network = new Network({ inputSize: 2 });
            assert.throws(function() { network.run([]); }, Error);
            assert.throws(function() { network.run([1]); }, Error);
            assert.throws(function() { network.run([1,2,3]); }, Error);
            assert.throws(function() { network.run([1,2,3,4]); }, Error);
            assert.throws(function() { network.run([1,2,3,4,5]); }, Error);
            network = new Network({ inputSize: 3 });
            assert.throws(function() { network.run([]); }, Error);
            assert.throws(function() { network.run([1]); }, Error);
            assert.throws(function() { network.run([1,2]); }, Error);
            assert.throws(function() { network.run([1,2,3,4]); }, Error);
            assert.throws(function() { network.run([1,2,3,4,5]); }, Error);
            network = new Network({ inputSize: 4 });
            assert.throws(function() { network.run([]); }, Error);
            assert.throws(function() { network.run([1]); }, Error);
            assert.throws(function() { network.run([1,2]); }, Error);
            assert.throws(function() { network.run([1,2,3]); }, Error);
            assert.throws(function() { network.run([1,2,3,4,5]); }, Error);
            network = new Network({ inputSize: 5 });
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
                outputSize: 3,
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
                inputSize: 3,
                outputSize: 5,
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
               "inputSize": 2,
               "hiddenSize": 3,
               "outputSize": 1,
               "layers": [
                  [
                     {
                        "bias": 0.13143138466402887,
                        "weights": [
                           0.020857981219887745
                        ]
                     },
                     {
                        "bias": -0.08996645789593459,
                        "weights": [
                           -0.1790315237827599
                        ]
                     }
                  ],
                  [
                     {
                        "bias": 3.1483718895317425,
                        "weights": [
                           -2.2795920406734957,
                           -2.3113516244213925
                        ]
                     },
                     {
                        "bias": 2.2686722893794675,
                        "weights": [
                           -5.967725611272962,
                           -5.988911456150587
                        ]
                     },
                     {
                        "bias": 4.148007480487826,
                        "weights": [
                           -2.9249843231750043,
                           -2.8969145442278283
                        ]
                     }
                  ],
                  [
                     {
                        "bias": -3.912162152100724,
                        "weights": [
                           3.9115427272689627,
                           -8.512680722143172,
                           5.1902442875249655
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
