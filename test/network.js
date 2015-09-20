var assert    = require('assert');
var Novabrain = require('./../index');
var Network   = Novabrain.Network;
var Layer     = Novabrain.Layer;
var Trainer   = Novabrain.Trainer;
var Transfer  = Novabrain.Transfer;
var Samples   = Novabrain.Samples;

describe('Network', function() {

    describe('#constructor()', function () {

        it('should throw Error for arguments expected', function () {
            assert.throws(function() {
                new Network();
            });
            assert.throws(function() {
                new Network(1);
            });
        });

        it('should have [layers] attribute', function () {
            var network = new Network(2,1);
            assert.ok(network.layers !== undefined);
        });

        it('should have 3 [layers]', function () {
            var network = new Network(2,1);
            assert.ok(Array.isArray(network.layers));
            assert.strictEqual(network.layers.length, 3);
        });

        it('should have 5 [layers]', function () {
            var network = new Network(2,4,5,3,1);
            assert.ok(Array.isArray(network.layers));
            assert.strictEqual(network.layers.length, 5);
        });

        it('should have 3 [layers] instance', function () {
            var network = new Network(2,3,1);
            assert.ok(Array.isArray(network.layers));
            assert.strictEqual(network.layers.length, 3);
            network.layers.forEach(function(layer) {
                assert.ok(layer instanceof Layer);
            });
        });

    });

    describe('#output()', function () {

        it('should throw Error if inputs param is not an array', function () {
            var network = new Network(2,1);
            assert.throws(function() { network.output(); }, Error);
        });

        it('should throw Error for expected inputs length', function () {
            var network = new Network(2,1);
            assert.throws(function() { network.output([0.3]); }, Error);
        });

        it('should not throw exception', function () {
            var network = new Network(2,1);
            assert.doesNotThrow(function() { network.output([1,2]); });
        });

        it('should return an array of 3 values between -1 and 1', function () {
            var network = new Network(5,3);
            var results = network.output([1,2,3,4,5]);
            results.forEach(function(result) {
                assert.ok(result >= -1);
                assert.ok(result <=  1);
            });
        });

        it('should return the defined values', function () {
            var network = (new Network(2,1)).import(Samples.XOR.config);
            var results = network.output([0.2,0.4]);
            assert.deepEqual(results, [0.9153394100871207]);
        });

        it('should return transfered values', function () {
            var network = (new Network(2,1)).import(Samples.OR.config);
            var results = network.output([0.2,0.4], Transfer.HARDLIMIT);
            assert.deepEqual(results, [1]);
        });

    });

    describe('#export()', function () {

        it('should return an array of layers', function () {
            var network = new Network(2, 1);
            network.import(Samples.AND.config);
            assert.deepEqual(network.export(), Samples.AND.config);
            assert.strictEqual(network.export().length, 3);
        });
    });

    describe('#import()', function () {

        it('should throw Error for bad layers count', function () {
            var network = new Network(2,1);
            assert.throws(function() {
                network.import([]);
            });
        });

        it('should throw Error for bad layer[0] neurons count', function () {
            var network = new Network(2,1);
            assert.throws(function() {
                network.import([[{}],[{}], [{}]]);
            });
        });

        it('should throw Error for missing neuron [bias] attribute', function () {
            var network = new Network(2,1);
            assert.throws(function() {
                network.import([[{}, {}],[{}], [{}]]);
            });
        });

        it('should throw Error for missing neuron [weights] values', function () {
            var network = new Network(2,1);
            assert.throws(function() {
                network.import([[{bias:1}, {}],[{}], [{}]]);
            });
        });

        it('should not throw Error', function () {
            var network = new Network(2,1);
            assert.doesNotThrow(function() {
                network.import(Samples.XOR.config);
            });
        });

        it('should copy network', function () {
            var n1 = new Network(2,1);
            var n2 = new Network(2,1);
            assert.doesNotThrow(function() {
                n1.import(Samples.AND.config);
            });
            assert.doesNotThrow(function() {
                n2.import(n1);
            });
            assert.doesNotThrow(function() {
                n2.import(n1.export());
            });
            assert.deepEqual(n1.export(), n2.export());
        });

    });

    describe('#standalone()', function () {

        it('should return a function', function () {
            var network = (new Network(2,1));
            assert.ok(typeof network.standalone() === 'function');
        });

        it('should return the defined values', function () {
            var network = (new Network(2,1)).import(Samples.AND.config);
            var results = network.output([0.2,0.4]);
            var standalone = network.standalone();
            assert.deepEqual(results, [ 0.009320581820383993 ]);
            assert.deepEqual(standalone([0.2,0.4]), results);
        });

        it('should return transfered values', function () {
            var network = (new Network(2,1)).import(Samples.OR.config);
            var results = network.output([0.2,0.4], Transfer.BOOLEAN);
            var standalone = network.standalone();
            assert.deepEqual(results, [ true ]);
            assert.deepEqual(standalone([0.2,0.4], Transfer.BOOLEAN), results);
        });

    });

});
