import React from 'react'
import Router from 'next/router'
import Emitter from '../../src/emitter'
import { watch } from '../../src/referential/watch'
import { loadable } from '../../components/app/loader'
import MnemonicForm from '../../components/forms/mnemonic'
import Api from '../../src/hanzo/api'
import {
  getIdentity,
  removeIdentity,
  setEncodedPrivateKeyFromMnemonic,
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
      loading: true,
      mnemonicLoaded: false,
    }

    this.emitter = new Emitter()

    this.emitter.once('mnemonic:finish', (mnemonic) => {
      this.setMnemonic(mnemonic)
    })

    // Load profile from Hanzo
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    if (!this.props.rootData.get('account.id')) {
      this.props.startLoading('Synchronizing Account...')
    }

    api.client.account.get()
      .then((res) => {
        this.props.rootData.set('account', res)
        this.props.stopLoading()

        this.setState({
          loading: false,
        })

      }).catch((err) => {
        console.log('Error on account.get', err)
        this.logout()
      })
  }

  componentWillUnmount() {
    this.emitter.off('mnemonic:finish')
  }

  setMnemonic(mnemonic) {
    setEncodedPrivateKeyFromMnemonic(mnemonic)

    this.setState({
      mnemonicLoaded: true,
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
            mnemonicLoaded: true,
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
          if !this.state.mnemonicLoaded
            MnemonicForm(emitter=this.emitter)
          else
            MnemonicForm(emitter=this.emitter)
      `
  }
}

export default Account
