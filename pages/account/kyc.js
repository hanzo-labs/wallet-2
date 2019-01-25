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

    this.mainRef = React.createRef()

    this.emitter = new Emitter()

    this.emitter.on('kyc:success', res => {
      this.props.rootData.set('account', res)

      this.setState({
        confirmed: true,
      })

      requestAnimationFrame(() => {
        this.mainRef.current.scrollIntoView()
      })
    })

    this.state = {
      confirmed: false,
    }
  }

  componentWillUnmount() {
    this.emitter.off('kyc:success')
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
    let props = this.props

    return pug`
      main#account-index.account(ref=this.mainRef)
        .content
          if this.state.confirmed
            .confirmation
              img(src='/static/img/big-check.svg')
              br
              h3.action-instruction Your identity is being verified.
              br
              .button(onClick=this.done)
                | CONTINUE
          else
            KYCForm(
              data=props.data
              emitter=this.emitter
            )

      `
  }
}

export default KYC
