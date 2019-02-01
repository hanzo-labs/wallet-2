import Web3 from 'web3'
import { ETH_NODE } from '../settings'
import stJson from './security-token'
import rtJson from './registry-token'

export default class EthApi {
  constructor(tokenContractAddress, registryContractAddress, privateKey, defaultAddress, endpoint = ETH_NODE) {
    this.client = new Web3(endpoint)
    this.tokenContractAddress = tokenContractAddress
    this.registryContractAddress = registryContractAddress
    this.privateKey = privateKey
    this.defaultAddress = defaultAddress

    this.stContract = new this.client.eth.Contract(stJson.abi, tokenContractAddress)

    this.rtContract = new this.client.eth.Contract(rtJson.abi, registryContractAddress)
  }

  balanceOf(address = this.defaultAddress) {
    return this.stContract.methods.balanceOf(address).call({ from: address })
  }
}
