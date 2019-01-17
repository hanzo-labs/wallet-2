import React from 'react'
import App, { Container } from 'next/app'
import { RefProvider } from '../src/referential/provider'
import Header from '../components/layout/header'
import Footer from '../components/layout/footer'

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props

    // console.log('App', pageProps)

    return pug`
      Container
        RefProvider
          Header
          Component
          Footer
    `
  }

  componentDidCatch (error, errorInfo) {
    console.log('CUSTOM ERROR HANDLING', error)
    // This is needed to render errors correctly in development / production
    super.componentDidCatch(error, errorInfo)
  }
}
