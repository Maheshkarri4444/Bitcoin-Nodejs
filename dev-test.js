// const Block = require("./blockchain/block");

// // const block = new Block('hi','this','is','mahesh');
// // console.log(block.toString());
// // console.log(Block.genesis().toString());

// const fooBlock = Block.mineBlock(Block.genesis(),'foo');
// console.log(fooBlock.toString());

// const Blockchain = require('./blockchain');

// const bc = new Blockchain();

// for ( let i = 0; i<10;i++){
//     console.log(bc.addBlock(`block ${i}`).toString())
// }

const Wallet = require('./wallet');
const wallet = new Wallet();
console.log(wallet.toString());