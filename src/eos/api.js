import { Api, JsonRpc, RpcError } from 'eosjs'
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig'
import { TextEncoder, TextDecoder } from 'text-encoding'
import {
  TOKEN_SYMBOL,
  EOS_NODE,
  EOS_TEST_ACCOUNT
} from '../settings'

export default class EosApi {
  constructor(contract, pksOrStr = [], defaultAccount = EOS_TEST_ACCOUNT, endpoint = EOS_NODE) {
    let pks = pksOrStr

    if (!(pks instanceof Array)) {
      pks = [pks]
    }

    this.contract = contract
    this.defaultAccount = defaultAccount
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

  transact(action, account, permission = 'active', data= {}) {
    return this.client.transact({
      actions: [{
        account: this.contract,
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

  getTableRows(scope, table, key) {
    return this.client.getTableRows(true, this.contract, scope, table, key)
  }

  getCurrencyBalance(account = this.defaultAccount, symbol = TOKEN_SYMBOL) {
    return this.rpc.get_currency_balance(this.contract, account, symbol)
  }

  balanceOf(account = this.defaultAccount, symbol = TOKEN_SYMBOL) {
    return this.getCurrencyBalance(account, symbol)
  }
}
