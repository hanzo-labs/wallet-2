import Coin from 'coin.js/src'

import { HANZO_KEY, HANZO_ENDPOINT, ETH_CONTRACT_ADDRESS, ETH_NODE } from '../settings'

export default class Coin {
  constructor({
    hanzoKey = HANZO_KEY,
    hanzoEndpoint = HANZO_ENDPOINT,
    ethContractAddress = ETH_CONTRACT_ADDRESS,
    ethNode = ETH_NODE
  }) {
    this.coin = Coin.start({
      key:       hanzoKey,
      endpoint:  hanzoEndpoint,
      processor: 'ethereum',
      currency:  'eth',
      mode: 'deposit',
      order: {
        subtotal:  1e9
      },
      eth: {
        address: ethContractAddress,
        node:    ethNode
      }
    })
  }

  login({ email, password }) {
    let m = coin.getMediator()

    return new Promise((resolve, reject) => {
      m.one('login-success', (x) => {
        resolve(x)
      })

      m.one('login-failed', (err) => {
        reject(err)
      })
    })
  }
}
