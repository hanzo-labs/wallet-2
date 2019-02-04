import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Router from 'next/router'
import Link from '../link'

import { withStyles } from '@material-ui/core/styles'
import { watch } from 'react-referential'
import Send from '@material-ui/icons/Send'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import { getIdentity } from '../../src/wallet'

@watch('footer')
class Footer extends React.Component {
  render() {
    let { classes, ...props } = this.props
    let identity = getIdentity()

    let accountLoaded = !!this.props.rootData.get('account.id') && identity

    return pug`
        if accountLoaded
          footer
            Toolbar(className=classes.noPadding)
              div(className=classes.flex1)
                Link(
                  className=classes.blockLink
                  href='/account/deposit'
                  color= Router.route == '/account/deposit' ? 'secondary' : 'textPrimary'
                  underline='none'
                )
                  ArrowUpward
                  .command Purchase
              div(className=classes.flex1)
                Link(
                  className=classes.blockLink
                  href='/account/send'
                  color= Router.route == '/account/send' ? 'secondary' : 'textPrimary'
                  underline='none'
                )
                  Send(className=classes.rotated)
                  .command Send
              div(className=classes.flex1)
                Link(
                  className=classes.blockLink
                  href='/account/redeem'
                  color= Router.route == '/account/redeem' ? 'secondary' : 'textPrimary'
                  underline='none'
                )
                  ArrowDownward
                  .command Redeem
    `
  }
}

const styles = (theme) => {
  return {
    flex1: {
      flex: 1,
      textAlign: 'center',
      padding: 2 * theme.spacing.unit,
    },
    noPadding: {
      padding: 0,
    },
    rotated: {
      transform: 'rotate(-45deg)',
      position: 'relative',
      left: '3px',
    },
    blockLink: {
      display: 'block',
    },
  }
}

export default withStyles(styles)(Footer)

