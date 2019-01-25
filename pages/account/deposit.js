import React from 'react'
import Router from 'next/router'
import PickBank from '../../components/forms/pick-bank'
import PickToken from '../../components/forms/pick-token'
import PickAddress from '../../components/forms/pick-address'
import PickAmount from '../../components/forms/pick-amount'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
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
      this.setState({
        bank: bank,
        step: 2,
      })
    })

    this.emitter.on('pick-token:submit', (token) => {
      this.setState({
        token:token,
        step: 3,
      })
    })

    this.emitter.on('pick-address:submit', (address) => {
      this.setState({
        address: address,
        step: 4,
      })
    })

    this.emitter.on('pick-amount:submit', (amount) => {
      this.setState({
        amount: amount,
        step: 5,
      })
    })

    this.emitter.on('pick-bank:back', () => {
      this.back()
    })

    this.emitter.on('pick-token:back', () => {
      this.back()
    })

    this.emitter.on('pick-address:back', () => {
      this.back()
    })

    this.emitter.on('pick-amount:back', () => {
      this.back()
    })

    this.state = {
      bank: null,
      token: null,
      address: null,
      amount: null,
      step: 1,
    }
  }

  componentWillUnmount() {
    this.emitter.off('pick-bank:submit')
    this.emitter.off('pick-bank:back')
    this.emitter.off('pick-token:submit')
    this.emitter.off('pick-token:back')
    this.emitter.off('pick-address:submit')
    this.emitter.off('pick-address:back')
    this.emitter.off('pick-amount:submit')
    this.emitter.off('pick-amount:back')
  }

  back() {
    if (this.state.step == 1) {
      Router.push('/')
    }
    this.setState({ step: this.state.step - 1 })
  }

  logout() {
    this.props.rootData.ref('account').clear()
    removeIdentity()
    Router.push('/')
  }

  done = () => {
    Router.push('/')
  }

  render() {
    let { classes } = this.props
    let { step } = this.state

    return pug`
      main#account-deposit.account
        .content
          if step != 5
            .icon
              ArrowUpward(style={ fontSize: 100 })
              br
          if step == 1
            PickBank(data=this.props.data emitter=this.emitter)
          if step == 2
            PickToken(data=this.props.data emitter=this.emitter)
          if step == 3
            PickAddress(data=this.props.data emitter=this.emitter)
          if step == 4
            PickAmount(data=this.props.data emitter=this.emitter)
          if step == 5
            .confirmation
              img(src='/static/img/big-check.svg')
              br
              h3.action-instruction Your transaction is being processed.
              br
              .button(onClick=this.done)
                | CONTINUE
      `
  }
}
