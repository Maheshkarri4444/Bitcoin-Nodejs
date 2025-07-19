const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE} = require("../config");
const Transaction = require('./transaction');

class Wallet{
    constructor(){
        this.balance=INITIAL_BALANCE;
        this.keyPair= ChainUtil.genKeyPair();
        this.publicKey=this.keyPair.getPublic().encode('hex');
    }

    toString(){
        return `Wallet -
        publicKey:${this.publicKey.toString()}
        balance  :${this.balance}
        `
    }

    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    createTransaction(recipient,amount,blockchain,transactionpool){
        this.balance = this.calculateBalance(blockchain);
        if(amount>this.balance){
            console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
            return;
       }

       let transaction = transactionpool.existingTransaction(this.publicKey);
       
       if(transaction){
        transaction.update(this,recipient,amount);
       }else{
        transaction = Transaction.newTransaction(this,recipient,amount);
        transactionpool.updateOrAddTransaction(transaction);
       }

       return transaction;

    }

    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];
        blockchain.chain.forEach(block=>block.data.forEach(transaction=>{
            transactions.push(transaction);
        }))

        const walletInputTs = transactions.filter(transaction=>transaction.input.address===this.publicKey)
        let startTime = 0;
        if(walletInputTs.length>0){
            const recentInputT = walletInputTs.reduce(
            (prev,current)=> prev.input.timestamp > current.input.timestamp ? prev:current
            )

            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            startTime = recentInputT.input.timestamp;
        }
        transactions.forEach(transaction => {
            if(transaction.input.timestamp >startTime){
                transaction.outputs.find(output=>{
                    if(output.address === this.publicKey){
                        balance+=output.amount;
                    }
                })
            }
        })

        return balance

    }

// calculateBalance(blockchain) {
//     let balance = 0;
//     let transactions = [];

//     // Collect all transactions from all blocks
//     for (const block of blockchain.chain) {
//         for (const transaction of block.data) {
//             transactions.push(transaction);
//         }
//     }

//     let spentTime = 0;

//     // Find the latest transaction where this wallet sent money
//     const walletTxs = transactions.filter(
//         tx => tx.input && tx.input.address === this.publicKey
//     );

//     if (walletTxs.length > 0) {
//         const recentTx = walletTxs.reduce((prev, curr) =>
//             prev.input.timestamp > curr.input.timestamp ? prev : curr
//         );

//         // Set balance to whatever was returned to the wallet in its latest transaction
//         const selfOutput = recentTx.outputs.find(
//             output => output.address === this.publicKey
//         );

//         balance = selfOutput ? selfOutput.amount : 0;
//         spentTime = recentTx.input.timestamp;
//     }

//     // Add amounts received in outputs after the latest spending
//     for (const tx of transactions) {
//         // Skip if it's the wallet's own outgoing tx or before its last spending
//         if (tx.input && tx.input.timestamp <= spentTime) continue;

//         for (const output of tx.outputs) {
//             if (output.address === this.publicKey) {
//                 balance += output.amount;
//             }
//         }
//     }

//     return balance;
// }



    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        console.log(`blockchain wallet: `,blockchainWallet)
        return blockchainWallet;
    }
}

module.exports = Wallet;