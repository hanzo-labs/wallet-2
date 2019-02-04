import React from 'react'
import Router from 'next/router'
import Emitter from '../../src/emitter'
import Link from '../../components/link'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Send from '@material-ui/icons/Send'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'

import moment from 'moment-timezone'

import { withStyles } from '@material-ui/core/styles'
import { watch } from 'react-referential'
import {
  getEncodedPrivateKey,
  canDecodePrivateKey,
} from '../../src/wallet'

@watch('transactionPage')
class Transactions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ethKey: '',
      eosKey: '',
    }

    if (!getEncodedPrivateKey() || !canDecodePrivateKey()) {
      this.logout()
    }
  }

  logout() {
    this.props.rootData.ref('account').clear()
    removeIdentity()
    Router.push('/')
  }

  render() {
    let { classes } = this.props
    let { step } = this.state

    let items = [
      {
        type: 'redeem',
        date: '2018-10-10 09:30:26.123',
        amount: 3,
      },
      {
        type: 'deposit',
        date: '2018-10-10 08:05:26.123',
        amount: 150,
      },
      {
        type: 'transfer',
        to: '0xF2FcCC0198fc6b39246Bd91272769D46d2F9D43b',
        date: '2018-10-09 16:16:26.123',
        amount: 1,
      },
      {
        type: 'transfer',
        to: '0xF2FcCC0198fc6b39246Bd91272769D46d2F9D43b',
        date: '2018-10-09 14:12:26.123',
        amount: 3,
      },
      {
        type: 'deposit',
        date: '2018-10-02 18:02:26.123',
        amount: 1457.75,
      },
    ]

    let listItems = []

    for (let k in items) {
      let { type, to, date, amount } = items[k]

      let Fragment = React.Fragment

      listItems.push(pug`
        Fragment
          ListItem
            if type == 'redeem'
              ListItemIcon
                ArrowDownward(className=classes.noMargin)
            if type == 'deposit'
              ListItemIcon
                ArrowUpward(className=classes.noMargin)
            if type == 'transfer'
              ListItemIcon
                Send(className=classes.rotated)
            ListItemText(
              primary=type.charAt(0).toUpperCase() + type.slice(1)
              secondary=to
            )
            ListItemText(
              className=classes.rightAligned
              primary=amount + ' ($' + amount + ')'
              secondary=moment(date).format('LLLL')
            )
          Divider
      `)
    }

    return pug`
      main#account-transactions.account
        .content
          h2 1,600.75
          small US Treasuries Token
          br
          br
          Paper
            List
              =listItems
          br
          Link(
            href='/'
          )
            | Back

      `
  }
}

const styles = theme => ({
  rightAligned: {
    textAlign: 'right',
  },
  rotated: {
    transform: 'rotate(-45deg)',
    position: 'relative',
    left: '3px',
    margin: 0,
  },
  noMargin: {
    margin: 0,
  },
})

export default withStyles(styles)(Transactions)
