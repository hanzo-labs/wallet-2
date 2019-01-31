import { Api, JsonRpc, RpcError } from 'eosjs'
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'
import { TextEncoder, TextDecoder } from 'text-encoding'


export default class EosApi {
  constructor(pksOrStr = [], endpoint = 'http://jungle2.cryptolions.io:80') {
    let pks = pksOrStr

    if (!(pks instanceof Array)) {
      pks = [pks]
    }

    this.endpoint = endpoint
    this.signatureProvider = new JsSignatureProvider(pks)
    this.rpc = new JsonRpc(endpoint, { fetch })
    this.client = new Api({
      rpc: this.rpc,
      signatureProvider: this.signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    })
  }

  transact(contract, action, account, permission = 'active', data= {}) {
    return this.client.transact({
      actions: [{
        account: contract,
        name: action,
        authorization: [{
          actor: account,
          permission: permission,
        }],
        data: data,
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30,
    });
  }

  getTableRows(contract, scope, table, key) {
    return this.client.getTableRows(true, contract, scope, table, key)
  }

  getCurrencyBalance(contract, account, symbol) {
    return this.rpc.get_currency_balance(contract, account, symbol)
  }
}
