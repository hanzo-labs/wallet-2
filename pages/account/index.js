import React from 'react'
import Router from 'next/router'
import Emitter from '../../src/emitter'
import MuiText from '../../components/controls/mui-text'
import TokenCard from '../../components/token-card'
import Link from '../../components/link'

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

    if (!this.props.rootData.get('account.id')) {
      this.props.startLoading(' ')
      this.loading = true
    }

    this.loadAccount()
  }

  generateMnemonic() {
    Router.push('/account/mnemonic')
  }

  logout() {
    this.props.rootData.ref('account').clear()
    removeIdentity()
    Router.push('/')
  }

  loadAccount() {
    // Load profile from Hanzo
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

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

  render() {
    let props = this.props
    let id = props.rootData.get('account.id')
    let identity = getIdentity()

    if (!id) {
      this.loadAccount()
    }

    // logout and clear sensitive data if identity is missing
    if (!identity) {
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
      main#account-index.account
        .content
          h5
            ='Hello, ' + props.rootData.get('account.firstName')
          h5 Here’s what your tokens have been doing.
          Link(href='/account/kyc')
            | Check your identify verification status.
          br
          small PORTFOLIO BALANCE:
          h1 2,825.40
          .simple-balances.columns.justify-flex-start
            .simple-balance
              .columns
                .simple-balance-logo
                  img(src='/static/img/eth-logo-blue.svg')
                p $1,000
            .simple-balance
              .columns
                .simple-balance-logo
                  img(src='/static/img/eos-logo-blue.png')
                p $600.75
          br
          .columns.justify-flex-start
            TokenCard(
              symbol='UST'
              count='1600.75'
              name='US Treasuries Token'
              value='$1600.75'
            )
      `
  }
}

export default Account
