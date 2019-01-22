import React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Link from '../link'

import { withStyles } from '@material-ui/core/styles'
import { watch } from '../../src/referential/provider'

@watch('footer')
class Footer extends React.Component {
  render() {
    let { classes, ...props } = this.props

    let accountLoaded = !!this.props.rootData.get('account.id')

    return pug`
        if accountLoaded
          footer
            Toolbar
              div(className=classes.flex1)
                Link(href='/')
                  img(className=classes.logoImg src='/static/img/logo.svg')
              div(className=classes.flex1)
                Link(href='/')
                  img(className=classes.logoImg src='/static/img/logo.svg')
              div(className=classes.flex1)
                Link(href='/')
                  img(className=classes.logoImg src='/static/img/logo.svg')
    `
  }
}

const styles = (theme) => {
  return {
    flex1: {
      flex: 1,
      textAlign: 'center',
      padding: 2 * theme.spacing.unit,
    }
  }
}

export default withStyles(styles)(Footer)

