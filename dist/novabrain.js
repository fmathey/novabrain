var Novabrain =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = {
	    Neuron: __webpack_require__(1),
	    Layer: __webpack_require__(3),
	    Network: __webpack_require__(4),
	    Trainer: __webpack_require__(5),
	    Transfer: __webpack_require__(2)
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Transfer = __webpack_require__(2);
	
	var Neuron = (function () {
	    function Neuron(size) {
	        _classCallCheck(this, Neuron);
	
	        this.bias = Math.random() * 0.4 - 0.2;
	        this.weights = [];
	        for (var i = 0; i < size; i++) {
	            this.weights.push(Math.random() * 0.4 - 0.2);
	        }
	    }
	
	    _createClass(Neuron, [{
	        key: 'output',
	        value: function output(inputs, transfer) {
	
	            if (!Array.isArray(inputs)) {
	                throw new Error('Inputs array expected');
	            }
	
	            if (inputs.length !== this.weights.length) {
	                throw new Error('Inputs length ' + this.weights.length + ' expected');
	            }
	
	            transfer = transfer || Transfer.LOGISTIC;
	
	            var sum = this.bias;
	            for (var i = 0, imax = this.weights.length; i < imax; i++) {
	                sum += this.weights[i] * inputs[i];
	            }
	            return transfer(sum);
	        }
	    }, {
	        key: 'export',
	        value: function _export() {
	            return {
	                bias: this.bias,
	                weights: this.weights.slice()
	            };
	        }
	    }]);
	
	    return Neuron;
	})();
	
	module.exports = Neuron;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {
	
	    LOGISTIC: function LOGISTIC(sum) {
	        return 1 / (1 + Math.exp(-sum));
	    },
	
	    HARDLIMIT: function HARDLIMIT(sum) {
	        return sum > 0 ? 1 : 0;
	    },
	
	    BOOLEAN: function BOOLEAN(sum) {
	        return sum > 0 ? true : false;
	    },
	
	    IDENTITY: function IDENTITY(sum) {
	        return sum;
	    },
	
	    TANH: function TANH(sum) {
	        var eP = Math.exp(sum);
	        var eN = 1 / eP;
	        return (eP - eN) / (eP + eN);
	    }
	
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Neuron = __webpack_require__(1);
	
	var Layer = (function () {
	    function Layer(numberOfNeurons, sizeOfNeurons) {
	        _classCallCheck(this, Layer);
	
	        this.neurons = [];
	        for (var i = 0; i < numberOfNeurons; i++) {
	            this.neurons.push(new Neuron(sizeOfNeurons));
	        }
	    }
	
	    _createClass(Layer, [{
	        key: 'output',
	        value: function output(inputs, transfer) {
	            var results = [];
	            this.neurons.forEach(function (neuron) {
	                results.push(neuron.output(inputs, transfer));
	            });
	            return results;
	        }
	    }, {
	        key: 'export',
	        value: function _export() {
	            var json = [];
	            this.neurons.forEach(function (neuron) {
	                json.push(neuron['export']());
	            });
	            return json;
	        }
	    }]);
	
	    return Layer;
	})();
	
	module.exports = Layer;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Layer = __webpack_require__(3);
	var Transfer = __webpack_require__(2);
	
	var Network = (function () {
	    function Network() {
	        _classCallCheck(this, Network);
	
	        this.layers = [];
	
	        var args = Array.prototype.slice.call(arguments);
	
	        if (args < 2) {
	            throw new Error('Network expected 2 integers or more');
	        }
	
	        if (args.length === 2) {
	            args.splice(1, 0, Math.max(3, Math.floor(args[0] / 2)));
	        }
	
	        this.layers.push(new Layer(args[0], 1));
	
	        for (var i = 1; i < args.length; i++) {
	            this.layers.push(new Layer(args[i], this.layers[i - 1].neurons.length));
	        }
	
	        this.transfer = Transfer.LOGISTIC;
	    }
	
	    _createClass(Network, [{
	        key: 'output',
	        value: function output(inputs, transfer) {
	            var outputs = [];
	            for (var i = 1; i < this.layers.length; i++) {
	                outputs = inputs = this.layers[i].output(inputs, transfer || this.transfer);
	            }
	            return outputs;
	        }
	    }, {
	        key: 'export',
	        value: function _export() {
	            var json = [];
	            for (var i = 0; i < this.layers.length; i++) {
	                json.push(this.layers[i]['export']());
	            }
	            return json;
	        }
	    }, {
	        key: 'import',
	        value: function _import(layers) {
	
	            if (layers instanceof Network) {
	                layers = layers['export']();
	            }
	
	            if (layers.length !== this.layers.length) {
	                throw new Error('Network expected [' + this.layers.length + '] layers');
	            }
	
	            for (var i = 0; i < this.layers.length; i++) {
	
	                var neurons = this.layers[i].neurons;
	
	                if (layers[i].length !== neurons.length) {
	                    throw new Error('Layer [' + i + '] expected [' + neurons.length + '] neurons');
	                }
	
	                for (var j = 0; j < neurons.length; j++) {
	
	                    var neuron = neurons[j];
	
	                    if (layers[i][j].bias === undefined) {
	                        throw new Error('Neuron [' + j + '] expected a [bias] value');
	                    }
	
	                    neuron.bias = layers[i][j].bias;
	
	                    if (!Array.isArray(layers[i][j].weights)) {
	                        throw new Error('Neuron [' + j + '] expected a [weights] array of [' + neuron.weights.length + '] values');
	                    }
	
	                    for (var k = 0; k < neuron.weights.length; k++) {
	                        neuron.weights[k] = layers[i][j].weights[k];
	                    }
	                }
	            }
	            return this;
	        }
	    }, {
	        key: 'standalone',
	        value: function standalone(transfer) {
	
	            transfer = Transfer.LOGISTIC.toString();
	
	            var layers = JSON.stringify(this['export']());
	
	            var buffer = '';
	
	            buffer += 'transfer = transfer || ' + transfer + ';';
	            buffer += 'var layers = ' + layers + ';';
	            buffer += 'for (var i = 1; i < layers.length; i++) {';
	            buffer += 'var layer = layers[i];';
	            buffer += 'var outputs = [];';
	            buffer += 'for (var j = 0; j < layer.length; j++) {';
	            buffer += 'var neuron = layer[j];';
	            buffer += 'var result = neuron.bias;';
	            buffer += 'for (var k = 0; k < neuron.weights.length; k++) {';
	            buffer += 'result += neuron.weights[k] * inputs[k];';
	            buffer += '}';
	            buffer += 'outputs[j] = transfer(result);';
	            buffer += '}';
	            buffer += 'inputs = outputs;';
	            buffer += '}';
	            buffer += 'return outputs;';
	
	            return new Function("inputs", "transfer", buffer);
	        }
	    }]);
	
	    return Network;
	})();
	
	module.exports = Network;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Network = __webpack_require__(4);
	
	var Trainer = (function () {
	    function Trainer(network) {
	        _classCallCheck(this, Trainer);
	
	        if (!(network instanceof Network)) {
	            throw new Error('Network instance expected');
	        }
	
	        this.network = network;
	        this.inputSize = network.layers[0].neurons.length;
	        this.outputSize = network.layers[network.layers.length - 1].neurons.length;
	        this.nbLayers = this.network.layers.length;
	        this.lastLayerId = this.nbLayers - 1;
	
	        this.training = {
	            changes: [],
	            iteration: {
	                errors: [],
	                deltas: []
	            }
	        };
	    }
	
	    //
	    // Trainer.train
	    //
	    // Train the network with back propagation
	    //
	    // @param  Array              : Training data
	    // @param  options.iterations : The number of back propagation iterations
	    // @param  options.learning   : Learning rate
	    // @param  options.momentum   : Reduction rate
	    // @param  options.treshold   : Error treshold to break iterations loop
	    // @param  options.callback   : Callback function for log
	    // @param  options.interval   : Callback function interval
	    // @return Object
	    //
	
	    _createClass(Trainer, [{
	        key: 'train',
	        value: function train(data, options) {
	            options = options || {};
	            options.iterations = options.iterations || 20000;
	            options.learning = options.learning || 0.3;
	            options.momentum = options.momentum || 0.1;
	            options.treshold = options.treshold || 0.005;
	            options.callback = options.callback || null;
	            options.interval = options.interval || 10;
	
	            if (!(Array.isArray(data[0].input) && data[0].input.length === this.inputSize)) {
	                throw new Error('Train expected an input data array of ' + this.inputSize);
	            }
	
	            if (!(Array.isArray(data[0].output) && data[0].output.length === this.outputSize)) {
	                throw new Error('Train expected an output data array of ' + this.outputSize);
	            }
	
	            this.changes = [];
	
	            var globalError = 10;
	            var iterationsCount = 0;
	
	            for (var i = 0; i < options.iterations && globalError > options.treshold; i++) {
	
	                var iterationError = 0;
	
	                for (var j = 0; j < data.length; j++) {
	                    var outputs = this.getOutputs(data[j].input);
	                    var target = data[j].output;
	
	                    this.prepare(outputs, target);
	
	                    this.propagate(outputs, options.learning, options.momentum);
	
	                    // Hidden layer errors sum
	                    iterationError += this.getErrorSum(this.training.iteration.errors[this.lastLayerId]);
	                }
	
	                // Global errors sum
	                globalError = iterationError / data.length;
	
	                if (options.callback && i % options.interval == 0) {
	                    options.callback({ error: globalError, iterations: i });
	                }
	
	                iterationsCount++;
	            }
	
	            return {
	                error: globalError,
	                iterations: iterationsCount
	            };
	        }
	
	        //
	        // Calculate errors and deltas
	        //
	    }, {
	        key: 'prepare',
	        value: function prepare(outputs, target) {
	
	            this.training.iteration.errors = [];
	            this.training.iteration.deltas = [];
	
	            for (var layerId = this.lastLayerId; layerId >= 0; layerId--) {
	
	                this.training.iteration.errors[layerId] = [];
	                this.training.iteration.deltas[layerId] = [];
	
	                var layer = this.network.layers[layerId];
	
	                for (var neuronId = 0; neuronId < layer.neurons.length; neuronId++) {
	
	                    var output = outputs[layerId][neuronId];
	                    var neuronError = 0;
	
	                    if (layerId === this.lastLayerId) {
	                        neuronError = target[neuronId] - output;
	                    } else {
	                        var delta = this.training.iteration.deltas[layerId + 1];
	                        for (var k = 0; k < delta.length; k++) {
	                            var weight = this.network.layers[layerId + 1].neurons[k].weights[neuronId];
	                            neuronError += delta[k] * weight;
	                        }
	                    }
	                    this.training.iteration.errors[layerId][neuronId] = neuronError;
	                    this.training.iteration.deltas[layerId][neuronId] = neuronError * output * (1 - output);
	                }
	            }
	
	            return this;
	        }
	
	        //
	        // Back propagate
	        //
	    }, {
	        key: 'propagate',
	        value: function propagate(outputs, learning, momentum) {
	            if (this.training.changes.length !== this.nbLayers) {
	                this.training.changes = new Array(this.nbLayers);
	            }
	
	            for (var layerId = 1; layerId < this.nbLayers; layerId++) {
	                var incoming = outputs[layerId - 1];
	                var layer = this.network.layers[layerId];
	
	                if (!Array.isArray(this.training.changes[layerId])) {
	                    this.training.changes[layerId] = new Array(layer.neurons.length);
	                }
	
	                for (var neuronId = 0; neuronId < layer.neurons.length; neuronId++) {
	                    var neuron = layer.neurons[neuronId];
	                    var delta = this.training.iteration.deltas[layerId][neuronId];
	
	                    if (!Array.isArray(this.training.changes[layerId][neuronId])) {
	                        this.training.changes[layerId][neuronId] = new Array(neuron.weights.length);
	                    }
	
	                    for (var k = 0; k < incoming.length; k++) {
	                        var change = this.training.changes[layerId][neuronId][k] || 0;
	                        change = learning * delta * incoming[k] + momentum * change;
	                        neuron.weights[k] += change;
	                        this.training.changes[layerId][neuronId][k] = change;
	                    }
	                    neuron.bias += learning * delta;
	                }
	            }
	
	            return this;
	        }
	    }, {
	        key: 'getOutputs',
	        value: function getOutputs(inputs) {
	            var outputs = [];
	            var output = outputs[0] = inputs.slice();
	            for (var i = 1; i < this.network.layers.length; i++) {
	                output = outputs[i] = this.network.layers[i].output(output);
	            }
	            return outputs;
	        }
	    }, {
	        key: 'getErrorSum',
	        value: function getErrorSum(errors) {
	            var sum = 0;
	            errors.forEach(function (error) {
	                sum += Math.pow(error, 2);
	            });
	            return sum / errors.length;
	        }
	    }]);
	
	    return Trainer;
	})();
	
	module.exports = Trainer;

/***/ }
/******/ ]);
//# sourceMappingURL=novabrain.js.map