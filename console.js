const {Blockchain, Transaction} = require ('./blockchain.js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // elliptic cure which is basis for bitcoin wallets

const myKey = ec.keyFromPrivate('e9679bb96f22b9fc4601cec22d11745377a61adcc212939e8c5423da7ea8c04e');
const myWalletAddress = myKey.getPublic('hex');

let cryptocoin1 = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
cryptocoin1.addTransaction(tx1)

// cryptocoin1.createTransaction(new Transaction('address1', 'address2', 2000))
// cryptocoin1.createTransaction(new Transaction('address2', 'address1', 20000))
console.log('Start to mine')
// cryptocoin1.minePendingTransactions('some address');
cryptocoin1.minePendingTransactions(myWalletAddress);
// console.log('Balance of this guy is', cryptocoin1.getBalanceOfAddress('some address'))
console.log('Balance of this guy is', cryptocoin1.getBalanceOfAddress(myWalletAddress))
console.log('Is chain valid?', cryptocoin1.isChainValid())

console.log(cryptocoin1)

// cryptocoin1.chain[1].transaction[0].amount = 1;

// console.log('Starting to mine once more...')
// cryptocoin1.minePendingTransactions('some address');
// console.log('Balance of this guy is', cryptocoin1.getBalanceOfAddress('some address'))
// shows miner balance gets 125 reward

// console.log('Mining Block: 1...')
// cryptocoin1.addBlock(new Block(1, "01-31-2019", {coinName: "blackcoin", amount: 100}))
// console.log('Mining Block: 2...')
// cryptocoin1.addBlock(new Block(2, "02-01-2019", {coinName: "blackcoin", amount: 1000}))

// console.log(JSON.stringify(cryptocoin1, null, 2))
// console.log(cryptocoin1, null, 4)

// console.log('Is blockchain valid?' + cryptocoin1.isChainValid());

// cryptocoin1.chain[1].data = {coinName: "blackcoin", amount: 100000};
// cryptocoin1.chain[1].hash = cryptocoin1.chain[1].hashCalculator();

// console.log('Is blockchain valid?' + cryptocoin1.isChainValid());
