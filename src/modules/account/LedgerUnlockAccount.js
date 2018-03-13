import Account from "./Account";
import {getAddress,sign} from "../../common/Loopring/ethereum/trezor";
import Transaction from "../../common/Loopring/ethereum/transaction";
import EthTransaction from 'ethereumjs-tx'
import {signatureRecover} from '../../common/Loopring/ethereum/utils'
import {clearPrefix, toBuffer,toHex,addHexPrefix} from '../../common/Loopring/common/formatter'

export default class LedgerUnlockAccount extends Account {

  constructor(input) {
    super({unlockType: 'ledger'})
    this.ledger = input.ledger
  }

  selected(input){
    this.dpath = input.dpath
    this.index = input.index
    super.setAddress(input.address)
  }

  getAddress() {
    return super.getAddress()
  }

  signMessage(message){
    console.log("Ledger sign")
    //TODO
  }

  getPathAddress(dpath, index) {
    return new Promise((resolve, reject) => {
      this.ledger.getAddress_async(dpath + "/" + index, false, true)
        .then(res => {
          console.log(dpath + "/" + index)
          resolve(res)
        })
        .catch(err => {
          console.error("error:", err)
          resolve({error:err})
        });
    })
  }

  signTx(tx){
    console.log(22222222)
    const ethTx = new EthTransaction(tx)
    return new Promise((resolve, reject) => {
      this.ledger
        .signTransaction_async(this.dpath+"/"+this.index, ethTx.serialize().toString('hex'))
        .then(result => {
          const txToSerialize = {
            ...tx,
            v: addHexPrefix(result.v),
            r: addHexPrefix(result.r),
            s: addHexPrefix(result.s)
          };
          const serializedTx = new EthTransaction(txToSerialize).serialize();
          resolve({result:serializedTx})
        })
        .catch(err => {
          console.error('Error:', err); // error message
          resolve({error:err})
        });
    });
  }

  async sendTransaction(tx) {
    console.log(11111111)
    let newTx = new Transaction(tx)
    await newTx.complete()
    const signed = await this.signTx(newTx.raw)
    if(signed.result){
      return await newTx.sendRawTx(toHex(signed.result))
    } else {
      throw new Error(signed.error)
    }
  }
}
