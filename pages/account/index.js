import React from 'react'
import Router from 'next/router'
import Emitter from '../../src/emitter'
import { watch } from '../../src/referential/provider'
import { loadable } from '../../components/app/loader'
import Api from '../../src/hanzo/api'
import {
  getIdentity,
  removeIdentity,
  getEncodedPrivateKey,
  canDecodePrivateKey,
  generateNthEthereumKeys,
  generateNthEOSKeys,
} from '../../src/wallet'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'

@watch('accountPage')
@loadable
class Account extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ethKey: '',
      eosKey: '',
    }

    if (!getEncodedPrivateKey() || !canDecodePrivateKey()) {
      this.generateMnemonic()
      return
    }

    // Load profile from Hanzo
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    if (!this.props.rootData.get('account.id')) {
      this.props.startLoading('Setting Up Account...')
      this.loading = true
    }

    api.client.account.get()
      .then((res) => {
        this.props.rootData.set('account', res)
        if (this.loading) {
          this.props.stopLoading()
        }

      }).catch((err) => {
        console.log('Error on account.get', err)
        this.logout()
      })
  }

  generateMnemonic() {
    requestAnimationFrame(() => {
      Router.push('/account/mnemonic')
    })
  }

  logout() {
    requestAnimationFrame(() => {
      this.props.rootData.ref('account').clear()
      removeIdentity()
      Router.push('/')
    })
  }

  render() {
    let props = this.props
    let id = props.rootData.get('account.id')
    let token = props.rootData.get('account.token')
    let identity = getIdentity()

    // logout and clear sensitive data if token or identity is missing
    if ((!token && !id) || !identity) {
      this.logout()
      return <div />
    }

    // Make Sure Keys are Loaded
    if (!this.state.ethKey || !this.state.eosKey) {
      try {
        let [ethKey] = generateNthEthereumKeys(1)
        let [eosKey] = generateNthEOSKeys(1)
        requestAnimationFrame(() => {
          this.setState({
            ethKey: ethKey,
            eosKey: eosKey,
          })
        })
      } catch (e) {
      }
    }

    return pug`
      main#account-index.hero.columns
        .content.columns
      `
  }
}

export default Account
