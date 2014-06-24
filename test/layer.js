
var assert = require('assert');
var Neuron = require('./../src/neuron');
var Layer  = require('./../src/layer');


describe('Layer', function() {

    describe('#constructor', function() {

        it('should throw an exception when invalid params are given', function() {
            assert.throws(function() { new Layer(); }, Error);
            assert.throws(function() { new Layer(0); }, Error);
            assert.throws(function() { new Layer(0, 0); }, Error);
        });

        it('should be an Array instance', function() {
            assert.ok(new Layer(1, 1) instanceof Array);
        });

        it('should push 1 neuron of 2 inputs (+1 bias) between -1 and 1', function() {
            var numberOfNeurons = 1;
            var numberOfInputsPerNeuron = 2;
            var layer = new Layer(numberOfNeurons, numberOfInputsPerNeuron);
            assert.strictEqual(layer.length, numberOfNeurons);
            layer.forEach(function(neuron) {
                assert.ok(neuron instanceof Neuron);
                assert.strictEqual(neuron.length, numberOfInputsPerNeuron + 1);
                neuron.forEach(function(weight) {
                    assert.ok(weight > -1 && weight < 1);
                });
            });
        });

        it('should push 2 neuron of 4 inputs (+1 bias) between -1 and 1', function() {
            var numberOfNeurons = 2;
            var numberOfInputsPerNeuron = 4;
            var layer = new Layer(numberOfNeurons, numberOfInputsPerNeuron);
            assert.strictEqual(layer.length, numberOfNeurons);
            layer.forEach(function(neuron) {
                assert.strictEqual(neuron.length, numberOfInputsPerNeuron + 1);
                neuron.forEach(function(weight) {
                    assert.ok(weight > -1 && weight < 1);
                });
            });
        });

        it('should push 12 neuron of 24 inputs (+1 bias) between -1 and 1', function() {
            var numberOfNeurons = 12;
            var numberOfInputsPerNeuron = 24;
            var layer = new Layer(numberOfNeurons, numberOfInputsPerNeuron);
            assert.strictEqual(layer.length, numberOfNeurons);
            layer.forEach(function(neuron) {
                assert.strictEqual(neuron.length, numberOfInputsPerNeuron + 1);
                neuron.forEach(function(weight) {
                    assert.ok(weight > -1 && weight < 1);
                });
            });
        });
    });

    describe('#run', function() {

        it('should throw an exception if the input param is not an array', function() {
            var layer = new Layer(1, 1);
            assert.throws(function() { layer.run(); }, Error);
            assert.throws(function() { layer.run({}); }, Error);
            assert.throws(function() { layer.run(0); }, Error);
            assert.throws(function() { layer.run(1); }, Error);
            assert.throws(function() { layer.run(2); }, Error);
            assert.throws(function() { layer.run('foo'); }, Error);
        });

        it('should throw an exception if the input array length is different of the neuron inputs number', function() {
            var layer = new Layer(1, 1);
            assert.throws(function() { layer.run([]); }, Error);
            assert.throws(function() { layer.run([1,2]); }, Error);
            assert.throws(function() { layer.run([1,2,3]); }, Error);
            assert.throws(function() { layer.run([1,2,3,4]); }, Error);
            assert.throws(function() { layer.run([1,2,3,4,5]); }, Error);
            layer = new Layer(1, 2);
            assert.throws(function() { layer.run([]); }, Error);
            assert.throws(function() { layer.run([1]); }, Error);
            assert.throws(function() { layer.run([1,2,3]); }, Error);
            assert.throws(function() { layer.run([1,2,3,4]); }, Error);
            assert.throws(function() { layer.run([1,2,3,4,5]); }, Error);
            layer = new Layer(1, 3);
            assert.throws(function() { layer.run([]); }, Error);
            assert.throws(function() { layer.run([1]); }, Error);
            assert.throws(function() { layer.run([1,2]); }, Error);
            assert.throws(function() { layer.run([1,2,3,4]); }, Error);
            assert.throws(function() { layer.run([1,2,3,4,5]); }, Error);
            layer = new Layer(1, 4);
            assert.throws(function() { layer.run([]); }, Error);
            assert.throws(function() { layer.run([1]); }, Error);
            assert.throws(function() { layer.run([1,2]); }, Error);
            assert.throws(function() { layer.run([1,2,3]); }, Error);
            assert.throws(function() { layer.run([1,2,3,4,5]); }, Error);
            layer = new Layer(1, 5);
            assert.throws(function() { layer.run([]); }, Error);
            assert.throws(function() { layer.run([1]); }, Error);
            assert.throws(function() { layer.run([1,2]); }, Error);
            assert.throws(function() { layer.run([1,2,3]); }, Error);
            assert.throws(function() { layer.run([1,2,3,4]); }, Error);
        });

        it('should return an array of 3 values', function() {
            var layer = new Layer(3, 3);
            var results = layer.run([1,2,3]);
            assert.ok(results instanceof Array);
            assert.ok(results.length === layer.length);
            results.forEach(function(result) {
                assert.ok(result >= 0 && result <= 1);
            });
        });

        it('should return an array of 9 values', function() {
            var layer = new Layer(9, 6);
            var results = layer.run([1,2,3,5,6,8]);
            assert.ok(results instanceof Array);
            assert.ok(results.length === layer.length);
            assert.ok(results.length === 9);
            results.forEach(function(result) {
                assert.ok(result >= 0 && result <= 1);
            });
        });

    });

});
