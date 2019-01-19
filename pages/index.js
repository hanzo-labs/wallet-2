import React from 'react'
import Router from 'next/router'
import { watch } from '../src/referential/watch'
import LoginForm from '../components/forms/login'
import Emitter from '../src/emitter'

@watch('indexPage')
class Index extends React.Component {
  constructor(props) {
    super(props)

    let emitter = this.emitter = new Emitter()

    emitter.on('login:success', res => {
      this.props.rootData.set('account.token', res.token)
      this.props.rootData.set('vault.identity', res.identity)

      Router.push('/account')
    })
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
