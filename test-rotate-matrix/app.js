var rotateMatrix = require('rotate-matrix');
 
var Factory = {
};

Factory.rotateMatrix = function (param){
    return rotateMatrix(param);
}

module.exports = Factory;