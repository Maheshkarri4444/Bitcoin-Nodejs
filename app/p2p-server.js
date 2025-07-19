const Websocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(','):[];
const MESSAGE_TYPES = {
    chain : 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
}

//for testing run this in 2nd terminal  HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
//in 3rd terminal HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
//in 4th terminal HTTP_PORT=3004 P2P_PORT=5004 PEERS=ws://localhost:5001,ws://localhost:5002,ws://localhost:5003 npm run dev




class P2pServer {
    constructor(blockchain,transactionPool){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    listen(){
        const server = new Websocket.Server({port:P2P_PORT});
        server.on('connection',socket=> this.connectSocket(socket));

        this.connectToPeers();
        
        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    connectToPeers(){
        peers.forEach(peer => {
            
            const socket = new Websocket(peer);

            socket.on('open',()=>this.connectSocket(socket));
        });
    }

    connectSocket(socket){
        this.sockets.push(socket);
        console.log("socket Connected")

        this.messageHandler(socket);
        // socket.send(JSON.stringify(this.blockchain.chain));
        this.sendChain(socket);
    }

    messageHandler(socket){
        socket.on('message',message=>{
            const data = JSON.parse(message);
            switch(data.type){
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }

           
        })
    }

    sendChain(socket){
        console.log(`P2Pport${P2P_PORT} chain:`,this.blockchain.chain)
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain}));
    }

    sendTransaction(socket,transaction){
        socket.send(JSON.stringify(
            {type: MESSAGE_TYPES.transaction,
            transaction: transaction}))
    }
    syncChains(){
        this.sockets.forEach(socket => this.sendChain(socket))
    }

    broadcastTransaction(transaction){
        this.sockets.forEach(socket=>this.sendTransaction(socket,transaction))
    }

    broadcastClearTransactions(){
        this.sockets.forEach(socket=>socket.send(JSON.stringify({
            type:MESSAGE_TYPES.clear_transactions
        })))
    }
}

module.exports = P2pServer;