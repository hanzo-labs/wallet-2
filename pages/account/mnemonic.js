import React from 'react'
import Router from 'next/router'
import Emitter from '../../src/emitter'
import { watch } from '../../src/referential/provider'
import { loadable } from '../../components/app/loader'
import MnemonicForm from '../../components/forms/mnemonic'
import {
  getIdentity,
  removeIdentity,
  setEncodedPrivateKeyFromMnemonic,
} from '../../src/wallet'

@watch('mnemonicPage')
@loadable
class Account extends React.Component {
  constructor(props) {
    super(props)

    this.emitter = new Emitter()

    this.emitter.once('mnemonic:finish', (mnemonic) => {
      this.setMnemonic(mnemonic)
    })

    let id = props.rootData.get('account.id')
    let token = props.rootData.get('account.token')
    let identity = getIdentity()

    if ((!token && !id) || !identity) {
      this.logout()
    }
  }

  componentWillUnmount() {
    this.emitter.off('mnemonic:finish')
  }

  setMnemonic(mnemonic) {
    setEncodedPrivateKeyFromMnemonic(mnemonic)

    Router.push('/account')
  }

  logout() {
    this.props.rootData.ref('account').clear()
    removeIdentity()
    Router.push('/')
  }

  render() {
    let props = this.props

    return pug`
      main#account-mnemonic.hero.columns
        .content.columns
          MnemonicForm(emitter=this.emitter)
      `
  }
}

export default Account
