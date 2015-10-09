'use strict';

module.exports = {

    LOGISTIC: function(sum) {
        return 1 / (1 + Math.exp(-sum));
    },

    HARDLIMIT: function(sum) {
        return sum > 0 ? 1 : 0;
    },

    BOOLEAN: function(sum) {
        return sum > 0 ? true : false;
    },

    IDENTITY: function(sum) {
        return sum;
    },

    TANH: function(sum) {
        var eP = Math.exp(sum);
        var eN = 1 / eP;
        return (eP - eN) / (eP + eN);
    }
    
};