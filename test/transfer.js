var assert = require('assert');
var Novabrain = require('./../index');
var Network = Novabrain.Network;
var Transfer = Novabrain.Transfer;

var network = new Network(2,1);

network.import([
    [
        { bias: 0.05928959753364327, weights: [ -0.192258741799742 ] },
        { bias: 0.09175631646066906, weights: [ -0.17425492424517872 ] }
    ],
    [
        { bias: 2.5840001297812463, weights: [ -1.8165617629814241, -2.136461683608381 ] },
        { bias: 4.473033492502, weights: [ -3.229261461719012, -3.0114854882427013 ] },
        { bias: 2.2533424713094674, weights: [ -5.903221446087271, -6.017580307145402 ] }
    ],
    [
        { bias: -3.8587626290548247, weights: [ 3.3935263526781227, 5.6898689489240715, -8.506710935516367 ] }
    ]
]);

var inputset = [
    [0,0],
    [0,1],
    [1,0],
    [1,1],
];

describe('Transfer', function() {

    describe('#LOGISTIC()', function () {

        it('should return transfered values', function () {
            network.transfer = Transfer.LOGISTIC;
            assert.strictEqual(network.output(inputset[0])[0], 0.058648060985912694);
            assert.strictEqual(network.output(inputset[1])[0], 0.9332407864377894);
            assert.strictEqual(network.output(inputset[2])[0], 0.9346227319410774);
            assert.strictEqual(network.output(inputset[3])[0], 0.08774908064488271);
        });

    });

    describe('#BOOLEAN()', function () {

        it('should return transfered values', function () {
            network.transfer = Transfer.BOOLEAN;
            assert.strictEqual(network.output(inputset[0])[0], false);
            assert.strictEqual(network.output(inputset[1])[0], true);
            assert.strictEqual(network.output(inputset[2])[0], true);
            assert.strictEqual(network.output(inputset[3])[0], false);
        });

    });

    describe('#HARDLIMIT()', function () {

        it('should return transfered values', function () {
            network.transfer = Transfer.HARDLIMIT;
            assert.strictEqual(network.output(inputset[0])[0], 0);
            assert.strictEqual(network.output(inputset[1])[0], 1);
            assert.strictEqual(network.output(inputset[2])[0], 1);
            assert.strictEqual(network.output(inputset[3])[0], 0);
        });

    });

    describe('#IDENTITY()', function () {

        it('should return transfered values', function () {
            network.transfer = Transfer.IDENTITY;
            assert.strictEqual(network.output(inputset[0])[0], 11.192551241014325);
            assert.strictEqual(network.output(inputset[1])[0], 37.99727065065635);
            assert.strictEqual(network.output(inputset[2])[0], 36.8709249382826);
            assert.strictEqual(network.output(inputset[3])[0], 63.67564434792462);
        });

    });

    describe('#TANH()', function () {

        it('should return transfered values', function () {
            network.transfer = Transfer.TANH;
            assert.strictEqual(network.output(inputset[0])[0], -0.9962325278654758);
            assert.strictEqual(network.output(inputset[1])[0], 0.9999999996051989);
            assert.strictEqual(network.output(inputset[2])[0], 0.9999999998459367);
            assert.strictEqual(network.output(inputset[3])[0], -0.9987800612608821);
        });

    });

});
