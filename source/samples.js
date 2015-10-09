'use strict';

module.exports = {

    XOR: {
        training: [
            { input: [0,0], output: [0] },
            { input: [0,1], output: [1] },
            { input: [1,0], output: [1] },
            { input: [1,1], output: [0] },
        ],

        config: [
            [
                { bias: 0.1804561257362366, weights: [ -0.167204974219203 ] },
                { bias: -0.04569602627307176, weights: [ 0.18746992871165274 ] }
            ],
            [
                { bias: 4.594158542478944, weights: [ -3.040062330305626, -3.362846210091373 ] },
                { bias: 2.253482826600183, weights: [ -5.98762513515333, -5.965287921412066 ] },
                { bias: 2.2578395038508865, weights: [ -2.0587523788017017, -1.562316369066697 ] }
            ],
            [
                { bias: -3.8152869540660492, weights: [ 5.941256505289369, -8.507284881253804, 3.1455340193310843 ] }
            ]
        ]
    },

    AND: {
        training: [
            { input: [0,0], output: [0] },
            { input: [0,1], output: [0] },
            { input: [1,0], output: [0] },
            { input: [1,1], output: [1] },
        ],

        config: [
            [
                { bias: 0.05568741559982299, weights: [ -0.07880215616896749 ] },
                { bias: 0.11339050624519587, weights: [ -0.08192619075998664 ] }
            ],
            [
                { bias: 1.2162003373115722, weights: [ -1.5325596790646399, -1.6694862833366626 ] },
                { bias: 3.5218949042093537, weights: [ -2.9473826605615274, -2.6480166644816325 ] },
                { bias: 1.2894144846904376, weights: [ -1.3971381146583233, -1.8841189975945027 ] }
            ],
            [
                { bias: 3.4025251093426854, weights: [ -2.7717050850924494, -5.672159962134176, -2.836860716358213 ] }
            ]
        ]
    },

    OR: {
        training: [
            { input: [0,0], output: [0] },
            { input: [0,1], output: [1] },
            { input: [1,0], output: [1] },
            { input: [1,1], output: [1] },
        ],

        config: [
            [
                { bias: 0.023853175062686194, weights: [ -0.05087699200958015 ] },
                { bias: -0.04783560279756785, weights: [ -0.12696466147899627 ] }
            ],
            [
                { bias: 0.7767897854256859, weights: [ -1.7520145026333327, -1.7771349756367834 ] },
                { bias: -0.47207093390546423, weights: [ 1.0731066688291095, 1.040178424526655 ] },
                { bias: -1.5422804887749049, weights: [ 3.1529762364879015, 3.1483531621536285 ] }
            ],
            [
                { bias: -1.2640437852289894, weights: [ -3.1821062179619575, 1.162433847357973, 4.845167062525612 ] }
            ]
        ]
    },

};