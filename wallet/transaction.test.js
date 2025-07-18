const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction',()=>{
    let transaction,wallet,recipient,amount;

    beforeEach(()=>{
        wallet = new Wallet();
        amount = 50;
        recipient='reciptentpublickey';
        transaction=  Transaction.newTransaction(wallet,recipient,amount);
    });
    it('outputs the `amount` subtracted from the wallet balance',()=>{
        // console.log(wallet.toString())
        // console.log(transaction.outputs)
        expect(transaction.outputs.find( output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount)
    })
    it('outputs the `amount` added to the recipient',()=>{
        // console.log(wallet.toString())
        // console.log(transaction.outputs)
        expect(transaction.outputs.find( output => output.address === recipient).amount).toEqual(amount)
    })
    it('inputs the balance of the wallet',()=>{
        expect(transaction.input.amount).toEqual(wallet.balance)
    })
    it('validates a valid transaction',()=>{
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    })
    it('invalidates a corrupt transaction',()=>{
        transaction.outputs[0].amount=50000,
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    })

    describe('transacting with an amount that exceeds the balance',()=>{
        beforeEach(()=>{
            amount = 5000;
            transaction = Transaction.newTransaction(wallet,recipient,amount);
        })
        it('does not create the transaction',()=>{
            expect(transaction).toEqual(undefined);
        })
    })
})