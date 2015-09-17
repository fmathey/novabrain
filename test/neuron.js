var assert = require('assert');
var Novabrain = require('./../index');
var Neuron = Novabrain.Neuron;
var Transfer = Novabrain.Transfer;

describe('Neuron', function() {

    describe('#constructor()', function () {

        it('should have [bias] attribute', function () {
            var neuron = new Neuron();
            assert.ok(neuron.bias !== undefined);
        });

        it('should have [bias] value between -1 and 1', function () {
            var neuron = new Neuron();
            assert.ok(neuron.bias >= -1 && neuron.bias <= 1);
        });

        it('should have [weights] attribute', function () {
            var neuron = new Neuron();
            assert.ok(neuron.weights !== undefined);
        });

        it('should [weights] attribute is array', function () {
            var neuron = new Neuron();
            assert.ok(Array.isArray(neuron.weights));
        });

        it('should have empty [weights]', function () {
            var neuron = new Neuron();
            assert.ok(neuron.weights.length === 0);
        });

        it('should have 8 [weights]', function () {
            var neuron = new Neuron(8);
            assert.equal(neuron.weights.length, 8);
        });

        it('should have [weights] values between -1 and 1', function () {
            var neuron = new Neuron(100);
            neuron.weights.forEach(function(weight) {
                assert.ok(weight >= -1 && weight <= 1);
            });
        });

    });

    describe('#output()', function () {

        it('should throw exception if inputs param is not an array', function () {
            var neuron = new Neuron();
            assert.throws(function() { neuron.output(); }, Error);
        });

        it('should throw exception if inputs length different of [weights] length', function () {
            var neuron = new Neuron(3);
            assert.throws(function() { neuron.output([]); }, Error);
        });

        it('should not throw exception', function () {
            var neuron = new Neuron(3);
            assert.doesNotThrow(function() { neuron.output([1,2,3]); });
        });

        it('should return values between -1 and 1', function () {
            for (var i = 0; i < 100; i++) {
                var neuron = new Neuron(4);
                var result = neuron.output([1,2,3,4]);
                assert.ok(result >= -1 && result <= 1);
            }
        });

        it('should return the defined value', function () {
            var neuron = new Neuron(4);
            neuron.bias = 0.1;
            neuron.weights = [0.2, 0.3, 0.4, 0.4];
            var result = neuron.output([0.5, 0.6, 0.7, 0.8]);
            assert.strictEqual(result, 0.7271082163411295);
        });

        it('should return transfered value', function () {
            var neuron = new Neuron(4);
            neuron.bias = 0.1;
            neuron.weights = [0.2, 0.3, 0.4, 0.4];
            var result = neuron.output([0.5, 0.6, 0.7, 0.8], Transfer.HARDLIMIT);
            assert.strictEqual(result, 1);
        });

        it('should return transfered value 15', function () {
            var neuron = new Neuron(4);
            neuron.bias = 0.1;
            neuron.weights = [0.2, 0.3, 0.4, 0.4];
            var result = neuron.output([0.5, 0.6, 0.7, 0.8], function(sum) {
                return 15;
            });
            assert.strictEqual(result, 15);
        });

    });

    describe('#export()', function () {

        it('should return [bias] and [weights] attributes', function () {
            var neuron = new Neuron(4);
            neuron.bias = 0.1;
            neuron.weights = [0.2, 0.3, 0.4, 0.4];
            assert.deepEqual(neuron.export(), {
                bias: 0.1,
                weights: [0.2, 0.3, 0.4, 0.4]
            });
        });

    });

});
