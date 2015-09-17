var assert = require('assert');
var Novabrain = require('./../index');
var Network = Novabrain.Network;
var Trainer = Novabrain.Trainer;
var Transfer = Novabrain.Transfer;

describe('Trainer', function() {

    describe('#constructor()', function () {

    });

    describe('#train()', function () {

        it('should train to resolve XOR', function () {
            var network = new Network(2,1);
            var trainer = new Trainer(network);

            network.transfer = Transfer.BOOLEAN;

            trainer.train([
                { input: [0,0], output: [0] },
                { input: [0,1], output: [1] },
                { input: [1,0], output: [1] },
                { input: [1,1], output: [0] },
            ]);

            assert.deepEqual(network.output([0,0]), [false]);
            assert.deepEqual(network.output([0,1]), [true]);
            assert.deepEqual(network.output([1,0]), [true]);
            assert.deepEqual(network.output([1,1]), [false]);
        });

        it('should train to resolve AND', function () {
            var network = new Network(2,1);
            var trainer = new Trainer(network);

            network.transfer = Transfer.BOOLEAN;

            trainer.train([
                { input: [0,0], output: [0] },
                { input: [0,1], output: [0] },
                { input: [1,0], output: [0] },
                { input: [1,1], output: [1] },
            ]);

            assert.deepEqual(network.output([0,0]), [false]);
            assert.deepEqual(network.output([0,1]), [false]);
            assert.deepEqual(network.output([1,0]), [false]);
            assert.deepEqual(network.output([1,1]), [true]);
        });

        it('should train to resolve OR', function () {
            var network = new Network(2,1);
            var trainer = new Trainer(network);

            network.transfer = Transfer.BOOLEAN;

            trainer.train([
                { input: [0,0], output: [0] },
                { input: [0,1], output: [1] },
                { input: [1,0], output: [1] },
                { input: [1,1], output: [1] },
            ]);

            assert.deepEqual(network.output([0,0]), [false]);
            assert.deepEqual(network.output([0,1]), [true]);
            assert.deepEqual(network.output([1,0]), [true]);
            assert.deepEqual(network.output([1,1]), [true]);
        });

    });

});
