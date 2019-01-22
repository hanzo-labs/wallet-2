import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Link from '../link'

import { withStyles } from '@material-ui/core/styles'
import { watch } from '../../src/referential/provider'
import Send from '@material-ui/icons/Send'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'

@watch('footer')
class Footer extends React.Component {
  render() {
    let { classes, ...props } = this.props

    let accountLoaded = !!this.props.rootData.get('account.id')

    return pug`
        if accountLoaded
          footer
            Toolbar(className=classes.noPadding)
              div(className=classes.flex1)
                Link(
                  href='/account/purchase'
                  color='default'
                  underline='none'
                )
                  ArrowUpward
                  .command Purchase
              div(className=classes.flex1)
                Link(
                  href='/account/send'
                  color='default'
                  underline='none'
                )
                  Send(className=classes.rotated)
                  .command Send
              div(className=classes.flex1)
                Link(
                  href='/account/redeem'
                  color='default'
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
  }
}

export default withStyles(styles)(Footer)

