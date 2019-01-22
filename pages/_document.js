import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    const { pageContext } = this.props

    return pug`
      html(
        lang='en'
        dir='ltr'
      )
        Head
          title Hanzo Wallet
          meta(charSet='utf-8')
          meta(
            httpEquiv='x-ua-compatible'
            content='ie=edge'
          )
          meta(
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
          )
          meta(
            name='msapplication-tap-highlight'
            content='no'
          )
          link(
            rel='manifest'
            href='/static/manifest.json'
          )
          link(
            rel='icon'
            type='image/png'
            href='/static/favicon.ico'
          )
        body
          Main
          NextScript
    `
  }
}
