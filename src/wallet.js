import React from 'react'
import akasha from './mjs-fix/akasha'
import * as aes from 'aes-js'
import * as ethers from 'ethers'
import * as wif from 'wif'
import * as ecc from 'eosjs-ecc'
import * as bip39 from 'bip39'
import * as hdkey from 'hdkey'

// Persistent Wallet
export let setIdentity = (identity) => {
  akasha.set('wallet.identity', identity)

  return identity
}

export let getIdentity = () => {
  return akasha.get('wallet.identity')
}

export let removeIdentity = () => {
  return akasha.remove('wallet.identity')
}

export let setEncodedPrivateKey = (pk) => {
  akasha.set('wallet.primarykey', pk)
}

export let getEncodedPrivateKey = (pk) => {
  akasha.get('wallet.primarykey')
}

export let setEncodedPrivateKeyFromMnemonic = (mnemonic) => {
  let id = akasha.get('wallet.identity')

  if (!id) {
    throw new Error('identity must be set to create private keys')
  }

  let key = ethers.utils.arrayify(id)

  let textBytes = aes.utils.utf8.toBytes(mnemonic)

  // The counter is optional, and if omitted will begin at 1
  let aesCtr = new (aes.ModeOfOperation.ctr)(key, new (aes.Counter)(5))
  let encryptedBytes = aesCtr.encrypt(textBytes)

  let pkEncoded = aes.utils.hex.fromBytes(encryptedBytes)

  akasha.set('wallet.primarykey', pkEncoded)

  return pkEncoded
}

export let generateNthEthereumKeys = (ns) => {
  let nss = ns

  if (Number.isInteger(nss)) {
    nss = [nss]
  }

  if (!Array.isArray(nss)) {
    throw new Error('argument[0] ns should be an integer or array of integers')
  }

  let id = akasha.get('wallet.identity')

  if (!id) {
    throw new Error('identity must be set to create private keys')
  }

  let key = ethers.utils.arrayify(id)

  let pkEncoded = akasha.get('wallet.primarykey')

  if (!pkEncoded) {
    throw new Error('primary key must exist to create private keys')
  }

  let encryptedBytes = aes.utils.hex.toBytes(pkEncoded)

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  let aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5))
  let decryptedBytes = aesCtr.decrypt(encryptedBytes)

  // Convert our bytes back into text
  let pk = aes.utils.utf8.fromBytes(decryptedBytes)

  let ethKeys = nss.map((n) => {
    if (!Number.isInteger(n)) {
      throw new Error('non-integer values cannot be used for generating keys')
    }

    let hdNode = ethers.utils.HDNode.fromMnemonic(pk)

    let { publicKey, privateKey } = hdNode.derivePath("m/44'/60'/0'/0/" + n)

    return { publicKey, privateKey }
  })

  return ethKeys
}

export let generateNthEOSKeys = (ns) => {
  let nss = ns

  if (Number.isInteger(nss)) {
    nss = [nss]
  }

  if (!Array.isArray(nss)) {
    throw new Error('argument[0] ns should be an integer or array of integers')
  }

  let id = akasha.get('wallet.identity')

  if (!id) {
    throw new Error('identity must be set to create private keys')
  }

  let key = ethers.utils.arrayify(id)

  let pkEncoded = akasha.get('wallet.primarykey')

  if (!pkEncoded) {
    throw new Error('primary key must exist to create private keys')
  }

  let encryptedBytes = aes.utils.hex.toBytes(pkEncoded)

  // The counter mode of operation maintains internal state, so to
  // decrypt a new instance must be instantiated.
  let aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5))
  let decryptedBytes = aesCtr.decrypt(encryptedBytes)

  // Convert our bytes back into text
  let pk = aes.utils.utf8.fromBytes(decryptedBytes)

  let seed = bip39.mnemonicToSeedHex(pk)
  let hdNode = hdkey.fromMasterSeed(Buffer(seed, 'hex'))

  let eosKeys = nss.map((n) => {
    if (!Number.isInteger(n)) {
      throw new Error('non-integer values cannot be used for generating keys')
    }

    let key = hdNode.derive("m/44'/194'/0'/0/" + n)

    return {
      publicKey: ecc.PublicKey(key._publicKey).toString(),
      privateKey: wif.encode(128, key._privateKey, false),
    }
  })

  return eosKeys
}

export let requiresWalletUnlocked = (WrappedComponent) => {
  class RequiresWalletUnlocked extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {

    }
  }
}