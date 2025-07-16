const Block = require("./blockchain/block");

// const block = new Block('hi','this','is','mahesh');
// console.log(block.toString());
// console.log(Block.genesis().toString());

const fooBlock = Block.mineBlock(Block.genesis(),'foo');
console.log(fooBlock.toString());