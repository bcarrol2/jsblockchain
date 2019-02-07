const SHA256 = require('crypto-js/SHA256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1'); // elliptic cure which is basis for bitcoin wallets

class Transaction {
  constructor(fromAddress, toAddress, amount){
  this.fromAddress = fromAddress;
  this.toAddress = toAddress;
  this.amount = amount;
  }

  calculateHash(){
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(singingKey){
    if(singingKey.getPublic('hex') !== this.fromAddress){
      throw new Error('You can only sign your transactions');
    }

    const hashTx = this.calculateHash();
    const sig = singingKey.sign(hashTx, 'base64');
    this.signiture = sig.toDER('hex');
  }

  isValid(){
    if(this.fromAddress === null) return true;
    //check if null, if it is then we assume it's valid

    if(!this.signiture || this.signiture.length === 0){
       throw new Error('No signiture in this transaction');
    }
    // then check for a signiture then if so we get the public key from it then verify that the transaction has been signed by that key
    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signiture);
  }
}

class Block{
  constructor(timestamp, transactions, previousHash = '') {
    // this.index = index;
    this.timestamp = new Date;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.hashCalculator();
    this.nonce = 0;
  }

  hashCalculator(){
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
      this.nonce++;
      this.hash = this.hashCalculator();
      // proof of work
    }
    console.log('Block mined: ' + this.hash);
  }

  hasValidTransactions(){
    for(const tx of this.transactions){
      if(!tx.isValid()){
        return false;
      }
    }
    return true;
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.genesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 125;
  }

  genesisBlock(){
    return new Block(Date.parse("02,01,2019"), [], "0");
  }

  getNewestBlock(){
    return this.chain[this.chain.length - 1];
  }

  // addBlock(newBlock){
  //   newBlock.previousHash = this.getNewestBlock().hash;
  //   // this sets previous hash of new property and gets the latest block and get the hash of that latest block
  //   newBlock.mineBlock(this.difficulty);
  //   // newBlock.hash = newBlock.hashCalculator();
  //   // now that we have changed the block we need to recalculate the hash(needs to happen anytime you change any property -from the newBlock constructor-)
  //   this.chain.push(newBlock)
  //   // not how you would actually safely add a newblock to the chain
  // }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('Successfully mined');
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ]
  }

  addTransaction(transaction){

    if(!transaction.fromAddress || !transaction.toAddress){
        throw new Error('Transaction has to include both a from and to address');
    }

    if(!transaction.isValid()){
      throw new Error('Cannot add an invalid transaction to chain');
    }
    // if passes these two conditions then it can be pushed onto the block
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;
    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
        balance -= trans.amount;
          }
        if(trans.toAddress === address){
        balance += trans.amount;
          }
        }
      }
      return balance;
    }

  isChainValid(){
    for(let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(!currentBlock.hasValidTransactions()){
        return false;
      }
      // verify that all transactions are valid

      if(currentBlock.hash !== currentBlock.hashCalculator()){
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hashCalculator()){
        return false;
      }
    }
    return true;
  }
  //this function goes over all the blocks in the chain and verifys that the hashes are correct and that each block links to the previous block


}

module.exports.Blockchain = Blockchain
module.exports.Transaction = Transaction
