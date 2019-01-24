import React from 'react'
import Router from 'next/router'
import Emitter from '../../src/emitter'
import KYCForm from '../../components/forms/kyc'

import { watch } from '../../src/referential/provider'
import { loadable } from '../../components/app/loader'
import {
  getEncodedPrivateKey,
  canDecodePrivateKey,
} from '../../src/wallet'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'

@watch('kycPage')
@loadable
class KYC extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }

    if (!getEncodedPrivateKey() || !canDecodePrivateKey()) {
      this.generateMnemonic()
      return
    }
  }

  logout() {
    this.props.rootData.ref('account').clear()
    removeIdentity()
    Router.push('/')
  }

  render() {
    let props = this.props

    return pug`
      main#account-index.account
        .content
          KYCForm(
            data=props.data
          )
      `
  }
}

export default KYC
