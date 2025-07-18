const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/sha256');
const {v1:uuidV1} = require('uuid');

class ChainUtil{
    static genKeyPair(){
        return ec.genKeyPair();
    }

    static uuid(){
        return uuidV1();
    }

    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey,signature,dataHash){
        return ec.keyFromPublic(publicKey,'hex').verify(dataHash,signature);
    }
}

module.exports = ChainUtil;