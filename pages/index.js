import React from 'react'
import Router from 'next/router'
import { watch } from '../src/referential/watch'
import '../styles.styl'
import LoginForm from '../components/forms/loginForm'

@watch('indexPage')
class Index extends React.Component {
  constructor(props) {
    super(props)

    // if (props.data.)
  }

  componentDidMount() {
    // if (store.user.isLoggedIn()) {
    //   // Do some nav stuff
    // } else {
    //   // Go home
    //   store.common.handleViewChange('')
    // }
  }

  render() {
    const onLogin = () => { store.common.handleViewChange('SOME LOGGED IN PAGE') }
    const handleLogin = () => {
      store.user.handleLogin(() => Router.push('/store')) // onLogin for page transition
      store.eos.getEOSInfo()
      store.eos.getCrossWorldsAccount()
    }

    // console.log('index', this.props.data)

    return pug`
      main#index.hero
        .content.columns
          .card.login
            .card-header.rows
              h2 Login
              .link(href='#') Create your account
            .card-body
              LoginForm(data=this.props.data)`
  }
}

export default Index
