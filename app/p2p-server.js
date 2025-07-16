const Websocket = require("ws");

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(','):[];

//for testing run this in 2nd terminal  HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 npm run dev
//in 3rd terminal HTTP_PORT=3003 P2P_PORT=5003 PEERS=ws://localhost:5001,ws://localhost:5002 npm run dev
//in 4th terminal HTTP_PORT=3004 P2P_PORT=5004 PEERS=ws://localhost:5001,ws://localhost:5002,ws://localhost:5003 npm run dev




class P2pServer {
    constructor(blockchain){
        this.blockchain = blockchain;
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
            // console.log("data: ",data);

            this.blockchain.replaceChain(data);
        })
    }

    sendChain(socket){
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    syncChains(){
        this.sockets.forEach(socket => this.sendChain(socket))
    }
}

module.exports = P2pServer;