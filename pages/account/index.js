import React from 'react'
import Router from 'next/router'
import Emitter from '../../src/emitter'
import { watch } from '../../src/referential/watch'
import { loadable } from '../../components/app/loader'
import MnemonicForm from '../../components/forms/mnemonic'
import Api from '../../src/hanzo/api'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'

@watch('accountPage')
@loadable
class Account extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
    }

    this.emitter = new Emitter()
  }

  logout() {
    requestAnimationFrame(() => {
      this.props.rootData.ref('account').clear()
      Router.push('/')
    })
  }

  componentDidMount() {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    if (!this.props.rootData.get('account.id')) {
      this.props.startLoading('Synchronizing Account...')
    }

    api.client.account.get()
      .then((res) => {
        this.props.rootData.set('account', res)
        this.props.stopLoading()

        this.state = {
          loading: false,
        }

      }).catch((err) => {
        console.log('Error on account.get', err)
        this.logout()
      })
  }

  render() {
    let props = this.props
    let id = props.rootData.get('account.id')
    let token = props.rootData.get('account.token')
    let identity = props.rootData.get('vault.identity')

    // logout and clear sensitive data if token or identity is missing
    if ((!token && !id) || !identity) {
      this.logout()
      return <div />
    }

    return pug`
      main#account-index.hero.columns
        .content.columns
          MnemonicForm(emitter=this.emitter)
      `
  }
}

export default Account
