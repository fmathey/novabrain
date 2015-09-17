var assert = require('assert');
var Novabrain = require('./../index');
var Layer = Novabrain.Layer;
var Neuron = Novabrain.Neuron;
var Transfer = Novabrain.Transfer;

describe('Layer', function() {

    describe('#constructor()', function () {

        it('should have [neurons] attribute', function () {
            var layer = new Layer();
            assert.ok(layer.neurons !== undefined);
        });

        it('should [neurons] attribute is array', function () {
            var layer = new Layer();
            assert.ok(Array.isArray(layer.neurons));
            assert.strictEqual(layer.neurons.length, 0);
        });

        it('should have 5 [neurons] instance', function () {
            var layer = new Layer(5);
            assert.strictEqual(layer.neurons.length, 5);
            for (var i = 0; i < layer.neurons.length; i++) {
                assert.ok(layer.neurons[i] instanceof Neuron);
            }
        });

        it('should have 3 [neurons] with empty [weights]', function () {
            var layer = new Layer(3);
            assert.strictEqual(layer.neurons.length, 3);
            for (var i = 0; i < layer.neurons.length; i++) {
                assert.strictEqual(layer.neurons[i].weights.length, 0);
            }
        });

        it('should have 7 [neurons] with 11 [weights]', function () {
            var layer = new Layer(7, 11);
            assert.strictEqual(layer.neurons.length, 7);
            for (var i = 0; i < layer.neurons.length; i++) {
                assert.strictEqual(layer.neurons[i].weights.length, 11);
            }
        });

    });

    describe('#output()', function () {

        it('should throw exception if inputs param is not an array', function () {
            var layer = new Layer(3);
            assert.throws(function() { layer.output(); }, Error);
        });

        it('should throw exception if inputs length different of [weights] length', function () {
            var layer = new Layer(7, 3);
            assert.throws(function() { layer.output([]); }, Error);
        });

        it('should not throw exception', function () {
            var layer = new Layer(2, 3);
            assert.doesNotThrow(function() { layer.output([1,2,3]); });
        });

        it('should return values between -1 and 1', function () {
            for (var i = 0; i < 100; i++) {
                var layer = new Layer(5, 4);
                var results = layer.output([1,2,3,4]);
                results.forEach((result) => {
                    assert.ok(result >= -1 && result <= 1);
                });
            }
        });

        it('should return the defined value', function () {
            var layer = new Layer(2, 4);
            layer.neurons[0].bias = 0.1;
            layer.neurons[0].weights = [0.2, 0.3, 0.4, 0.4];
            layer.neurons[1].bias = -0.1;
            layer.neurons[1].weights = [-0.2, -0.3, -0.4, -0.4];
            var result = layer.output([0.5, 0.6, 0.7, 0.8]);
            assert.deepEqual(result, [0.7271082163411295, 0.27289178365887046]);
        });

        it('should return transform values', function () {
            var layer = new Layer(2, 4);
            layer.neurons[0].bias = 0.1;
            layer.neurons[0].weights = [0.2, 0.3, 0.4, 0.4];
            layer.neurons[1].bias = -0.1;
            layer.neurons[1].weights = [-0.2, -0.3, -0.4, -0.4];
            var result = layer.output([0.5, 0.6, 0.7, 0.8], Transfer.HARDLIMIT);
            assert.deepEqual(result, [1, 0]);
        });

    });

    describe('#export()', function () {
        it('should return a [neurons] array with [bias] and [weights] attributes', function () {
            var layer = new Layer(2, 4);
            layer.neurons[0].bias = 0.1;
            layer.neurons[0].weights = [0.2, 0.3, 0.4, 0.4];
            layer.neurons[1].bias = -0.1;
            layer.neurons[1].weights = [-0.2, -0.3, -0.4, -0.4];
            assert.deepEqual(layer.export(), [
                {
                    bias: 0.1,
                    weights: [0.2, 0.3, 0.4, 0.4]
                },
                {
                    bias: -0.1,
                    weights: [-0.2, -0.3, -0.4, -0.4]
                }
            ]);
        });
    });

});
