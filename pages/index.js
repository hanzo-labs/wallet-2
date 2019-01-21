import React from 'react'
import Router from 'next/router'
import { watch } from '../src/referential/provider'
import LoginForm from '../components/forms/login'
import Emitter from '../src/emitter'
import { setIdentity } from '../src/wallet'

@watch('indexPage')
class Index extends React.Component {
  constructor(props) {
    super(props)

    this.emitter = new Emitter()

    this.emitter.on('login:success', res => {
      this.props.rootData.set('account.token', res.token)
      setIdentity(res.identity)

      Router.push('/account')
    })
  }

  componentWillUnmount() {
    this.emitter.off('login:success')
  }

  render() {
    return pug`
      main#index.hero.columns
        .content.columns
          .card.login.transparent
            .card-header.rows
              h2 Login
              .link(href='#') Create your account
            .card-body
              LoginForm(
                data=this.props.data
                emitter=this.emitter
              )
    `
  }
}

export default Index
