import React from 'react'
import Router from 'next/router'
import Emitter from '../../src/emitter'
import MuiText from '../../components/controls/mui-text'
import TokenCard from '../../components/token-card'
import Link from '../../components/link'

import { watch } from '../../src/referential/provider'
import { loadable } from '../../components/app/loader'
import Api from '../../src/hanzo/api'
import EOSApi from '../../src/eos/api'

import {
  getIdentity,
  removeIdentity,
  getEncodedPrivateKey,
  canDecodePrivateKey,
  generateNthEthereumKeys,
  generateNthEOSKeys,
} from '../../src/wallet'
import {
  HANZO_KEY,
  HANZO_ENDPOINT,
  TOKEN_SYMBOL,
  EOS_TOKEN_ACCOUNT,
  EOS_TEST_ACCOUNT,
} from '../../src/settings.js'

@watch('accountPage')
@loadable
class Account extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ethKey: '',
      eosKey: '',
      ethBalance: '0.0000',
      eosBalance: '0.0000',
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
    let identity = getIdentity()
    // logout and clear sensitive data if identity is missing
    if (!identity) {
      this.logout()
    }

    let ethKey, eosKey

    try {
      [ethKey] = generateNthEthereumKeys(1)
      [eosKey] = generateNthEOSKeys(1)

      this.setState({
        ethKey: ethKey,
        eosKey: eosKey,
      })
    } catch (e) {
      this.logout()
    }

    // Load EOS Balance
    let eosApi = new EOSApi(eosKey)

    let pEos = eosApi.getCurrencyBalance(EOS_TOKEN_ACCOUNT, EOS_TEST_ACCOUNT, TOKEN_SYMBOL)
      .then(([res]) => {
        let amount = res.split(' ')[0]
        this.setState({
          eosBalance: amount,
        })
        console.log(res)
      }).catch((err) => {
        console.log('Error on getCurrencyBalance', err)
      })

    // Load profile from Hanzo
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    let pHanzo = api.client.account.get()
      .then((res) => {
        this.props.rootData.set('account', res)
        this.props.rootData.set('kycPage.kycForm.kyc', res.kyc)

        if (this.loading) {
          this.props.stopLoading()
        }

      }).catch((err) => {
        console.log('Error on account.get', err)
        this.logout()
      })

    return Promise.all[pEos, pHanzo]
  }

  render() {
    let props = this.props

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
          h1 1,600.75
          .simple-balances.columns.justify-flex-start
            .simple-balance
              .columns
                .simple-balance-logo
                  img(src='/static/img/eth-logo-blue.svg')
                p=this.state.ethBalance
            .simple-balance
              .columns
                .simple-balance-logo
                  img(src='/static/img/eos-logo-blue.png')
                p=this.state.eosBalance
          br
          .token-cards.columns.justify-flex-start
            Link(
              href='/account/transactions'
              underline='none'
            )
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
