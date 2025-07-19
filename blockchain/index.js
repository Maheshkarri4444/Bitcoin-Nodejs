const Block = require('./block');

class Blockchain {
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock(data){
        const block = Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(block);

        return block;
    }

    isValidChain(chain){
        console.log(`isValidChain:-`,JSON.stringify(chain.chain[0]));
        console.log('genisis:- ',JSON.stringify(Block.genesis()))
        if(JSON.stringify(chain.chain[0]) !== JSON.stringify(Block.genesis())) return false;
        console.log(`genisis passed`);
        for (let i = 1; i<chain.length; i++){
            const block = chain[i];
            const lastBlock = chain[i-1];
            
            if ( block.lastHash !== lastBlock.hash || block.hash!== Block.blockHash(block)){
                console.log(`testing failed here`)
                return false
            }
        }
    return true;
    }

    replaceChain(newChain){
        if(newChain.chain.length <= this.chain.length){
            console.log("Received chain is no longer than the current chain");
            return;
        } else if (!this.isValidChain(newChain)){
            console.log("the received chain is not valid");
            return;
        }

        console.log("replacing blockchain with the new chain ");
        this.chain = newChain.chain;
    }
}

module.exports = Blockchain;