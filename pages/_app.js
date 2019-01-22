import React from 'react'
import App, { Container } from 'next/app'
import Router from 'next/router'
import RefProvider from '../src/referential/provider'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'
import Loader, { startLoading, stopLoading } from '../components/app/loader'
import 'reeeset/src/reeeset.css'
import '../styles.styl'

import blue from '@material-ui/core/colors/blue'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

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
    stopLoading()
  }

  render () {
    const { Component, pageProps } = this.props


    return pug`
      Container
        MuiThemeProvider(theme=theme)
          RefProvider
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
})

Router.events.on('routeChangeComplete', () => {
  stopLoading()
})

Router.events.on('routeChangeError', () => {
  stopLoading()
})
