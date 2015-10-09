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
	    Transfer: __webpack_require__(2),
	    Samples: __webpack_require__(6)
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

	'use strict';
	
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
	        this.errors = [];
	        this.deltas = [];
	        this.changes = [];
	    }
	
	    _createClass(Trainer, [{
	        key: 'reset',
	        value: function reset() {
	            this.errors = [];
	            this.deltas = [];
	            this.changes = this.network['export']();
	            for (var i in this.network.layers) {
	                for (var j in this.network.layers[i].neurons) {
	                    for (var k in this.network.layers[i].neurons[j].weights) {
	                        this.changes[i][j].weights[k] = 0;
	                    }
	                }
	            }
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
	    }, {
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
	
	            this.reset();
	
	            var globalError = 10;
	            var iterationsCount = 0;
	
	            for (var i = 0; i < options.iterations && globalError > options.treshold; i++) {
	
	                var iterationError = 0;
	
	                for (var j = 0; j < data.length; j++) {
	                    iterationError += this.trainPattern(data[j].input, data[j].output, options.learning, options.momentum);
	                }
	
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
	    }, {
	        key: 'trainPattern',
	        value: function trainPattern(input, target, learning, momentum) {
	
	            learning = learning || 0.3;
	            momentum = momentum || 0.1;
	
	            var outputs = this.getOutputs(input);
	
	            // Calculate errors and deltas
	
	            for (var layerId = this.lastLayerId; layerId >= 0; layerId--) {
	                this.errors[layerId] = [];
	                this.deltas[layerId] = [];
	                for (var neuronId = 0; neuronId < this.network.layers[layerId].neurons.length; neuronId++) {
	                    var output = outputs[layerId][neuronId];
	                    var neuronError = 0;
	                    if (layerId === this.lastLayerId) {
	                        neuronError = target[neuronId] - output;
	                    } else {
	                        for (var k = 0; k < this.deltas[layerId + 1].length; k++) {
	                            var weight = this.network.layers[layerId + 1].neurons[k].weights[neuronId];
	                            neuronError += this.deltas[layerId + 1][k] * weight;
	                        }
	                    }
	                    this.errors[layerId][neuronId] = neuronError;
	                    this.deltas[layerId][neuronId] = neuronError * output * (1 - output);
	                }
	            }
	
	            // Back propagate
	
	            for (var layerId = 1; layerId < this.nbLayers; layerId++) {
	                var incoming = outputs[layerId - 1];
	                var layer = this.network.layers[layerId];
	                for (var neuronId = 0; neuronId < layer.neurons.length; neuronId++) {
	                    var neuron = layer.neurons[neuronId];
	                    var delta = this.deltas[layerId][neuronId];
	                    for (var k = 0; k < incoming.length; k++) {
	                        var change = this.changes[layerId][neuronId][k] || 0;
	                        change = learning * delta * incoming[k] + momentum * change;
	                        neuron.weights[k] += change;
	                        this.changes[layerId][neuronId][k] = change;
	                    }
	                    neuron.bias += learning * delta;
	                }
	            }
	
	            return this.getErrorSum(this.errors[this.lastLayerId]);
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

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	
	    XOR: {
	        training: [{ input: [0, 0], output: [0] }, { input: [0, 1], output: [1] }, { input: [1, 0], output: [1] }, { input: [1, 1], output: [0] }],
	
	        config: [[{ bias: 0.1804561257362366, weights: [-0.167204974219203] }, { bias: -0.04569602627307176, weights: [0.18746992871165274] }], [{ bias: 4.594158542478944, weights: [-3.040062330305626, -3.362846210091373] }, { bias: 2.253482826600183, weights: [-5.98762513515333, -5.965287921412066] }, { bias: 2.2578395038508865, weights: [-2.0587523788017017, -1.562316369066697] }], [{ bias: -3.8152869540660492, weights: [5.941256505289369, -8.507284881253804, 3.1455340193310843] }]]
	    },
	
	    AND: {
	        training: [{ input: [0, 0], output: [0] }, { input: [0, 1], output: [0] }, { input: [1, 0], output: [0] }, { input: [1, 1], output: [1] }],
	
	        config: [[{ bias: 0.05568741559982299, weights: [-0.07880215616896749] }, { bias: 0.11339050624519587, weights: [-0.08192619075998664] }], [{ bias: 1.2162003373115722, weights: [-1.5325596790646399, -1.6694862833366626] }, { bias: 3.5218949042093537, weights: [-2.9473826605615274, -2.6480166644816325] }, { bias: 1.2894144846904376, weights: [-1.3971381146583233, -1.8841189975945027] }], [{ bias: 3.4025251093426854, weights: [-2.7717050850924494, -5.672159962134176, -2.836860716358213] }]]
	    },
	
	    OR: {
	        training: [{ input: [0, 0], output: [0] }, { input: [0, 1], output: [1] }, { input: [1, 0], output: [1] }, { input: [1, 1], output: [1] }],
	
	        config: [[{ bias: 0.023853175062686194, weights: [-0.05087699200958015] }, { bias: -0.04783560279756785, weights: [-0.12696466147899627] }], [{ bias: 0.7767897854256859, weights: [-1.7520145026333327, -1.7771349756367834] }, { bias: -0.47207093390546423, weights: [1.0731066688291095, 1.040178424526655] }, { bias: -1.5422804887749049, weights: [3.1529762364879015, 3.1483531621536285] }], [{ bias: -1.2640437852289894, weights: [-3.1821062179619575, 1.162433847357973, 4.845167062525612] }]]
	    }
	
	};

/***/ }
/******/ ]);
//# sourceMappingURL=novabrain.js.map