import React from 'react'
import Router from 'next/router'
import PickBank from '../../components/forms/pick-bank'
import PickToken from '../../components/forms/pick-token'
import PickAddress from '../../components/forms/pick-address'
import Emitter from '../../src/emitter'

import { watch } from '../../src/referential/provider'
import { loadable } from '../../components/app/loader'
import {
  getEncodedPrivateKey,
  canDecodePrivateKey,
} from '../../src/wallet'

@watch('depositPage')
@loadable
export default class Account extends React.Component {
  constructor(props) {
    super(props)

    if (!getEncodedPrivateKey() || !canDecodePrivateKey()) {
      this.logout()
    }

    this.emitter = new Emitter()

    this.emitter.on('pick-bank:submit', (bank) => {
      this.setState({ bank })
    })

    this.emitter.on('pick-token:submit', (token) => {
      this.setState({ token })
    })

    this.emitter.on('pick-address:submit', (address) => {
      this.setState({ address })
    })

    this.emitter.on('pick-amount:submit', (amount) => {
      this.setState({ amount })
    })

    this.state = {
      bank: null,
      token: null,
      address: null,
      amount: null,
    }
  }

  logout() {
    this.props.rootData.ref('account').clear()
    removeIdentity()
    Router.push('/')
  }

  handleOnExit = () => {
  }

  handleOnSuccess = () => {
  }

  render() {
    let { classes } = this.props

    return pug`
      main#account-deposit.account
        .content
          PickBank(data=this.props.data emitter=this.emitter)
          PickToken(data=this.props.data emitter=this.emitter)
          PickAddress(data=this.props.data emitter=this.emitter)
      `
  }
}
