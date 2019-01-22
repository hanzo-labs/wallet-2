import React from 'react'
import Router from 'next/router'
import Emitter from '../../src/emitter'
import MuiListPicker from '../../components/controls/mui-list-picker'
import TokenCard from '../../components/token-card'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import AccountBalance from '@material-ui/icons/AccountBalance'
import AddCircleOutlined from '@material-ui/icons/AddCircleOutlined'
import Button from '@material-ui/core/Button'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { withStyles } from '@material-ui/core/styles'
import { watch } from '../../src/referential/provider'
import { loadable } from '../../components/app/loader'
import Api from '../../src/hanzo/api'
import {
  getIdentity,
  removeIdentity,
  getEncodedPrivateKey,
  canDecodePrivateKey,
  generateNthEthereumKeys,
  generateNthEOSKeys,
} from '../../src/wallet'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'

const styles = theme => ({
  noMargin: {
    margin: 0,
  },
})

@watch('depositPage')
@loadable
class Account extends React.Component {
  constructor(props) {
    super(props)

    if (!getEncodedPrivateKey() || !canDecodePrivateKey()) {
      this.logout()
    }
  }

  logout() {
    this.props.rootData.ref('account').clear()
    removeIdentity()
    Router.push('/')
  }

  handleOnExit = () => {
  }

  handleOnSuccess = () => {
  }

  render() {
    let { classes } = this.props

    let bankOptions = [
      {
        value: 0,
        label: 'First Demo Bank',
        subLabel: 'Account ending in 1234',
        icon: AccountBalance,
      },
    ]

    return pug`
      main#account-deposit.account
        .content
          .content-header
            ArrowUpward(style={ fontSize: 100 })
            h2 Select a Bank Account
            br
          Card.list-picker-wrapper
            CardMedia
              MuiListPicker(options=bankOptions value=0)
                ListItem(
                  button
                )
                  ListItemIcon(className=classes.noMargin)
                    AddCircleOutlined(style={ fontSize: 36 })
                  ListItemText
                    | Add a Bank Account
          br
          .content-footer.columns
            .button
              | BACK
            .button
              | CONFIRM BANK
      `
  }
}

export default withStyles(styles)(Account)
