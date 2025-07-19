const ChainUtil = require('../chain-util');
const {MINING_REWARD} = require('../config');

class Transaction{
    constructor(){
        this.id = ChainUtil.uuid();
        this.input = null;
        this.outputs=[];
        // this.coinbase = false;
    }

    update(senderWallet,recipient,amount){
        const senderOutput = this.outputs.find(output=>output.address === senderWallet.publicKey);

        if ( amount > senderOutput.amount){
            console.log(`Amount: ${amount} exceeds the balance`)
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount,address: recipient});
        Transaction.signTransaction(this,senderWallet);

        return this;

    }

    static transactionWithOutputs(senderWallet,outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction,senderWallet)
        return transaction
    
    }

    static newTransaction(senderWallet,recipient,amount){
    

        if (amount > senderWallet.balance){
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        return Transaction.transactionWithOutputs(senderWallet,
            [
            {amount: senderWallet.balance - amount , address: senderWallet.publicKey},
            {amount, address:recipient}
        ]
        )
    }

    static rewardTransaction(minerWallet,blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet,[{
            amount:MINING_REWARD,address:minerWallet.publicKey
        }])
    }
    // static rewardTransaction(minerWallet) {
    //     const transaction = new this();
    //     transaction.coinbase = true;
    //     transaction.outputs.push({
    //         amount: MINING_REWARD,
    //         address: minerWallet.publicKey
    //     });
    //     transaction.input = null; // No input for coinbase tx
    //     return transaction;
    // }

    static signTransaction(transaction,senderWallet){
        transaction.input = {
            timestamp:Date.now(),
            amount:senderWallet.balance,
            address:senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction){
        // if (transaction.coinbase) {
        //     const totalOutput = transaction.outputs.reduce((sum, out) => sum + out.amount, 0);
        //     if (totalOutput !== MINING_REWARD) {
        //         console.log("Invalid coinbase amount");
        //         return false;
        //     }
        //     return true;
        // }
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        )
    }

}

module.exports = Transaction;