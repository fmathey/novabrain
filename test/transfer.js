'use strict';

var assert    = require('assert');
var Novabrain = require('./../index');
var Network   = Novabrain.Network;
var Transfer  = Novabrain.Transfer;
var XOR       = Novabrain.Samples.XOR;

var network = new Network(2,1);

network.import(XOR.config);

var inputset = [
    XOR.training[0].input,
    XOR.training[1].input,
    XOR.training[2].input,
    XOR.training[3].input,
];

describe('Transfer', function() {

    describe('#LOGISTIC()', function () {

        it('should return transfered values', function () {
            network.transfer = Transfer.LOGISTIC;
            assert.strictEqual(network.output(inputset[0])[0], 0.05817070272629486);
            assert.strictEqual(network.output(inputset[1])[0], 0.9357947138317898);
            assert.strictEqual(network.output(inputset[2])[0], 0.9321080693260643);
            assert.strictEqual(network.output(inputset[3])[0], 0.08798035983254547);
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
            assert.strictEqual(network.output(inputset[0])[0], 11.410877961419455);
            assert.strictEqual(network.output(inputset[1])[0], 37.26543049772407);
            assert.strictEqual(network.output(inputset[2])[0], 37.81164500701164);
            assert.strictEqual(network.output(inputset[3])[0], 63.66619754331625);
        });

    });

    describe('#TANH()', function () {

        it('should return transfered values', function () {
            network.transfer = Transfer.TANH;
            assert.strictEqual(network.output(inputset[0])[0], -0.9961031921497002);
            assert.strictEqual(network.output(inputset[1])[0], 0.9999999998258696);
            assert.strictEqual(network.output(inputset[2])[0], 0.9999999990491668);
            assert.strictEqual(network.output(inputset[3])[0], -0.998772445390827);
        });

    });

});
