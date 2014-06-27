
var assert = require('assert');
var Network = require('./../src/base-network');

describe('BaseNetwork', function(){

    describe('#constructor', function(){

        it('should have 6 weight', function() {
            var network = new Network();
            assert.strictEqual(network.export().weights.length, 6);
            assert.strictEqual(network.size, 6);
        });

        it('should throw an exception for invalid weights', function() {
            assert.throws(function() {
                var network = new Network({
                    numberOfHiddenLayers: 3,
                    weights: [1,2]
                });
            });
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
            var network = new Network();
            var results = network.run([1]);
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
            var results = network.run([1]);
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
                numberOfInputs: 1,
                numberOfOutputs: 1,
                numberOfHiddenLayers: 1,
                numberOfNeuronsPerHiddenLayer: 1,
                weights: [
                    0.042384160216897726,
                    -0.4777564317919314,
                    0.5611297953873873,
                    -0.30416952446103096,
                    -0.6487653669901192,
                    0.18558572605252266
                ]
            };

            var network = new Network(options);

            assert.deepEqual(options, network.export());
        });

    });

    describe('#update', function() {

        it('should import weights', function() {
            var expectedOptions = {
                numberOfInputs: 1,
                numberOfOutputs: 1,
                numberOfHiddenLayers: 1,
                numberOfNeuronsPerHiddenLayer: 1,
                weights: [
                    0.042384160216897726,
                    -0.4777564317919314,
                    0.5611297953873873,
                    -0.30416952446103096,
                    -0.6487653669901192,
                    0.18558572605252266
                ]
            };

            var network = new Network({
                numberOfInputs: 1,
                numberOfOutputs: 1,
                numberOfHiddenLayers: 1,
                numberOfNeuronsPerHiddenLayer: 1,
             });

            network.update([
                0.042384160216897726,
                -0.4777564317919314,
                0.5611297953873873,
                -0.30416952446103096,
                -0.6487653669901192,
                0.18558572605252266
            ]);

            assert.deepEqual(expectedOptions, network.export());
        });

        it('should throw an exception', function() {
            var options = {
                numberOfInputs: 1,
                numberOfOutputs: 1,
                numberOfHiddenLayers: 1,
                numberOfNeuronsPerHiddenLayer: 1,
                weights: [
                    0.042384160216897726,
                    -0.4777564317919314,
                    0.5611297953873873,
                    -0.30416952446103096,
                    -0.6487653669901192,
                    0.18558572605252266
                ]
            };

            var network = new Network(options);

            assert.throws(function() { 
                network.update([
                    0.042384160216897726,
                    -0.4777564317919314,
                ]);
            });

        });

    });

});
