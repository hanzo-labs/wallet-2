import React from 'react'
import App, { Container } from 'next/app'
import Router from 'next/router'
import { MuiPickersUtilsProvider } from 'material-ui-pickers'
import RefProvider from 'react-referential'
import BalanceProvider from '../src/balances'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import Loader, { startLoading, stopLoading } from '../components/app/loader'

import MomentUtils from '@date-io/moment'
import { loadLibrary } from '../src/library'
import Api from '../src/hanzo/api'
import { HANZO_KEY, HANZO_ENDPOINT } from '../src/settings.js'

import blue from '@material-ui/core/colors/blue'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import 'reeeset/src/reeeset.css'
import '../styles.styl'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: blue[500],
    },
    secondary: {
      main: 'rgba(29,226,160,0.7)',
    },
    background: {
      paper: '#272B3F',
    },
  },
})

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  componentDidMount() {
    if (typeof window != 'undefined') {
      startLoading()

      let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

      loadLibrary(api.client).then(() => {
        stopLoading()
      }).catch((err) => {
        console.log('library loading error', err)
        stopLoading()
      })
    } else {
      stopLoading()
    }
  }

  render () {
    const { Component, pageProps } = this.props


    return pug`
      Container
        MuiThemeProvider(theme=theme)
          MuiPickersUtilsProvider(utils=MomentUtils)
            RefProvider
              BalanceProvider
                Header
                Component
                Footer
                Loader
    `
  }

  componentDidCatch (error, errorInfo) {
    console.log('CUSTOM ERROR HANDLING', error)
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo)
  }
}

Router.events.on('routeChangeStart', () => {
  startLoading(' ')
  setTimeout(() => {
    stopLoading()
  }, 3000)
})

Router.events.on('routeChangeComplete', () => {
  stopLoading()
})

Router.events.on('routeChangeError', () => {
  stopLoading()
})
