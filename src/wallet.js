import akasha from './mjs-fix/akasha'
import * as aes-js from 'aes-js'
import * as ethers from 'ethers'
import * as wif from 'wif'
import * as ecc from 'eosjs-ecc'

// Persistent Wallet
export let setIdentity = (identity) => {
  akasha.set('wallet.identity', identity)

  return identity
}

export let getIdentity = () => {
  return akasha.get('wallet.identity')
}

export let setEncodedPrivateKey = (pk) = {
  store.set('wallet.primarykey', pk)
}

export let getEncodedPrivateKey = (pk) = {
  store.get('wallet.primarykey')
}

export let setEncodedPrivateKeyFromMnemonic = (mnemonic) = {
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

  store.set('wallet.primarykey', pkEncoded)

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

  let pkEncoded = store.get('wallet.primarykey')

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

  let ethKeys = ns.map((n) => {
    if (!Number.isInteger(n)) {
      throw new Error('non-integer values cannot be used for generating keys')
    }

    let privateKey = ethers.Wallet.fromMnemonic(pk, "m/44'/60'/0'/0/" + n).address

    return signingKeys = ethers.utils.SigningKey(privateKey)
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

  let pkEncoded = store.get('wallet.primarykey')

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

  let hdNode = ethers.utils.HDNode.fromMnemonic(pk)

  let eosKeys = ns.map((n) => {
    if (!Number.isInteger(n)) {
      throw new Error('non-integer values cannot be used for generating keys')
    }

    let node = hdNode.derive("m/44'/194'/0'/0/" + n)

    return {
      publicKey: ecc.PublicKey(node._publicKey).toString(),
      privateKey: wif.encode(128, node._privateKey, false),
    }
  })

  return eosKeys
}
