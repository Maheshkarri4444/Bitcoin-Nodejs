const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const {v1:uuidV1} = require('uuid');

class ChainUtil{
    static genKeyPair(){
        return ec.genKeyPair();
    }

    static uuid(){
        return uuidV1();
    }
}

module.exports = ChainUtil;