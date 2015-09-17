var assert = require('assert');
var Novabrain = require('./../index');
var Network = Novabrain.Network;
var Layer   = Novabrain.Layer;
var Trainer = Novabrain.Trainer;
var Transfer = Novabrain.Transfer;

var networkConfigTest = [
    [
        {bias: -0.13752707047387958, weights: [0.19243250247091054]},
        {bias: -0.07921435488387943, weights: [0.16750794807448982]}
    ],
    [
        {bias: 0.05040031857788563, weights: [-0.19811222013086083, -0.06754875825718046]},
        {bias: -0.008431669883429999, weights: [-0.09689404666423798, -0.1895773339085281]},
        {bias: -0.19032581867650153, weights: [0.17723346007987856, 0.08597935801371931]}
    ],
    [
        {bias: -0.08970609167590737, weights: [0.018543000426143402, 0.0574993586167693, -0.13078986080363392]}
    ]
];

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
            var network = (new Network(2,1)).import(networkConfigTest);
            var results = network.output([0.2,0.4]);
            assert.deepEqual(results, [0.47135421428669444]);
        });

        it('should return transfered values', function () {
            var network = (new Network(2,1)).import(networkConfigTest);
            var results = network.output([0.2,0.4], Transfer.HARDLIMIT);
            assert.deepEqual(results, [0]);
        });

    });

    describe('#export()', function () {

        it('should return an array of layers', function () {
            var network = new Network(2, 1);
            network.import(networkConfigTest);
            assert.deepEqual(network.export(), networkConfigTest);
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
                network.import(networkConfigTest);
            });
        });

        it('should copy network', function () {
            var n1 = new Network(2,1);
            var n2 = new Network(2,1);
            assert.doesNotThrow(function() {
                n1.import(networkConfigTest);
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
            var network = (new Network(2,1)).import(networkConfigTest);
            var results = network.output([0.2,0.4]);
            var standalone = network.standalone();
            assert.deepEqual(results, [ 0.47135421428669444 ]);
            assert.deepEqual(standalone([0.2,0.4]), results);
        });

        it('should return transfered values', function () {
            var network = (new Network(2,1)).import(networkConfigTest);
            var results = network.output([0.2,0.4], Transfer.BOOLEAN);
            var standalone = network.standalone();
            assert.deepEqual(results, [ false ]);
            assert.deepEqual(standalone([0.2,0.4], Transfer.BOOLEAN), results);
        });

    });

});
