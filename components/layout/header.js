import React from 'react'

import Form, { MuiText } from 'react-referential-forms'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Link from '../link'
import Router from 'next/router'

import { withStyles } from '@material-ui/core/styles'
import { watch } from 'react-referential'
import {
  getIdentity,
  removeIdentity,
} from '../../src/wallet'

let currencies = {
  usd: 'USD',
  eur: 'EUR',
  jpy: 'JPY',
}

@watch('header')
class Header extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anchorEl: null,
    }
  }

  handleMenu = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    })
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
    })
  }

  logout = () => {
    this.setState({
      anchorEl: null,
    })

    this.props.rootData.ref('account').clear()
    removeIdentity()
    Router.push('/')
  }

  render() {
    let { classes, ...props } = this.props
    let identity = getIdentity()
    let accountLoaded = !!this.props.rootData.get('account.id') && identity

    let open = !!this.state.anchorEl

    return pug`
        if accountLoaded
          AppBar(
            className=classes.root
            position='fixed'
            color="default"
          )
            Toolbar(className=classes.noPadding)
              Link(href='/')
                img(className=classes.logoImg src='/static/img/logo.svg')
              div(className=classes.grow)
              MuiText(
                select
                value='usd'
                className=classes.textField
                SelectProps={
                  MenuProps: {
                    className: classes.menu,
                  },
                }
                margin="normal"
                options=currencies
              )
              IconButton(
                aria-owns=(open ? 'menu-appbar' : undefined)
                aria-haspopup='true'
                onClick=this.handleMenu
                color='inherit'
              )
                AccountCircle(style={ fontSize: 36 })
              Menu(
                id='menu-appbar'
                anchorEl=this.state.anchorEl
                anchorOrigin={
                  vertical: 'bottom',
                  horizontal: 'right',
                }
                transformOrigin={
                  vertical: 'bottom',
                  horizontal: 'right',
                }
                open=open
                onClose=this.handleClose
              )
                MenuItem(onClick=this.logout) Logout
    `
  }
}

const styles = (theme) => {
  return {
    root: {
      background: 'transparent',
      boxShadow: 'none',
    },
    noPadding: {
      padding: 0,
    },
    grow: {
      flexGrow: 1,
    },
    logoImg: {
      maxHeight: 36,
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    menu: {
      width: 200,
    }
  }
}

export default withStyles(styles)(Header)
