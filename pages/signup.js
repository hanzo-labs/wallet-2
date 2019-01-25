import React from 'react'
import Router from 'next/router'
import { watch } from '../src/referential/provider'
import SignupForm from '../components/forms/signup'
import Emitter from '../src/emitter'
import { setIdentity } from '../src/wallet'

import Link from '../components/link'
import {
  getEncodedPrivateKey,
} from '../src/wallet'

@watch('signupPage')
class Index extends React.Component {
  constructor(props) {
    super(props)

    this.emitter = new Emitter()

    this.emitter.on('signup:success', res => {
      this.props.rootData.set('account.token', res.token)
      setIdentity(res.identity)

      this.signup()
    })
  }

  signup() {
    Router.push('/account/mnemonic')
  }

  componentWillUnmount() {
    this.emitter.off('signup:success')
  }

  render() {
    return pug`
      if !this.hasIdentity
        main#signup.hero.columns
          .content.columns
            .card.signup.transparent
              .card-header.rows
                h2 Sign Up
                Link(
                  href='/',
                  underline='hover'
                )
                  | Already have an account?
              .card-body
                SignupForm(
                  data=this.props.data
                  emitter=this.emitter
                )
    `
  }
}

export default Index
