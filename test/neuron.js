
var assert = require('assert');
var Neuron = require('./../lib/neuron');

describe('Neuron', function(){

    describe('#constructor', function(){

        it('should throw an exception when invalid number of inputs is defined', function(){
            assert.throws(function() { new Neuron(); }, Error);
            assert.throws(function() { new Neuron(0); }, Error);
        });

        it('should be an Array instance', function(){
            assert.ok(new Neuron(1) instanceof Array);
        });

        it('should push 3 random weights between -1 and 1 for 2 inputs', function(){
            var neuron = new Neuron(2);
            assert.strictEqual(neuron.length, 3);
            neuron.forEach(function(weight) {
                assert.ok(weight !== 0 && weight > -1 && weight < 1);
            });
        });

        it('should push 4 random weights between -1 and 1 for 3 inputs', function(){
            var neuron = new Neuron(3);
            assert.strictEqual(neuron.length, 4);
            neuron.forEach(function(weight) {
                assert.ok(weight !== 0 && weight > -1 && weight < 1);
            });
        });

    });

    describe('#run', function(){

        it('should throw an exception if the input param is not an array', function(){
            var neuron = new Neuron(1);
            assert.throws(function() { neuron.run(); }, Error);
            assert.throws(function() { neuron.run({}); }, Error);
            assert.throws(function() { neuron.run(0); }, Error);
            assert.throws(function() { neuron.run(1); }, Error);
            assert.throws(function() { neuron.run(2); }, Error);
            assert.throws(function() { neuron.run('foo'); }, Error);
        });

        it('should throw an exception if the input array length is different of the inputs number', function(){
            var neuron = new Neuron(1);
            assert.throws(function() { neuron.run([]); }, Error);
            assert.throws(function() { neuron.run([1,2]); }, Error);
            assert.throws(function() { neuron.run([1,2,3]); }, Error);
            assert.throws(function() { neuron.run([1,2,3,4]); }, Error);
            assert.throws(function() { neuron.run([1,2,3,4,5]); }, Error);
            neuron = new Neuron(2);
            assert.throws(function() { neuron.run([]); }, Error);
            assert.throws(function() { neuron.run([1]); }, Error);
            assert.throws(function() { neuron.run([1,2,3]); }, Error);
            assert.throws(function() { neuron.run([1,2,3,4]); }, Error);
            assert.throws(function() { neuron.run([1,2,3,4,5]); }, Error);
            neuron = new Neuron(3);
            assert.throws(function() { neuron.run([]); }, Error);
            assert.throws(function() { neuron.run([1]); }, Error);
            assert.throws(function() { neuron.run([1,2]); }, Error);
            assert.throws(function() { neuron.run([1,2,3,4]); }, Error);
            assert.throws(function() { neuron.run([1,2,3,4,5]); }, Error);
            neuron = new Neuron(4);
            assert.throws(function() { neuron.run([]); }, Error);
            assert.throws(function() { neuron.run([1]); }, Error);
            assert.throws(function() { neuron.run([1,2]); }, Error);
            assert.throws(function() { neuron.run([1,2,3]); }, Error);
            assert.throws(function() { neuron.run([1,2,3,4,5]); }, Error);
            neuron = new Neuron(5);
            assert.throws(function() { neuron.run([]); }, Error);
            assert.throws(function() { neuron.run([1]); }, Error);
            assert.throws(function() { neuron.run([1,2]); }, Error);
            assert.throws(function() { neuron.run([1,2,3]); }, Error);
            assert.throws(function() { neuron.run([1,2,3,4]); }, Error);
        });

        it('should return a value between 0 and 1', function(){
            var result = null;
            assert.ok((result = (new Neuron(1)).run([1]) >= 0) && result <= 1);
            assert.ok((result = (new Neuron(2)).run([1,2]) >= 0) && result <= 1);
            assert.ok((result = (new Neuron(3)).run([1,2,3]) >= 0) && result <= 1);
            assert.ok((result = (new Neuron(4)).run([1,2,3,4]) >= 0) && result <= 1);
            assert.ok((result = (new Neuron(5)).run([1,2,3,4,5]) >= 0) && result <= 1);
        });

        it('should return 1 for this neuron', function(){
            var neuron = new Neuron(4);
            neuron[0] = 1;
            neuron[1] = 2;
            neuron[2] = 3;
            neuron[3] = 4;
            neuron[4] = 5;
            assert.strictEqual(neuron.run([1,2,3,4]), 1);
        });

        it('should return 0.9695869982586831 for this neuron', function(){
            var neuron = new Neuron(3);
            neuron[0] = 0.234;
            neuron[1] = -0.52;
            neuron[2] = 0.893;
            neuron[3] = 0.654;
            assert.strictEqual(neuron.run([1,2,3]), 0.9695869982586831);
        });

    });

});
