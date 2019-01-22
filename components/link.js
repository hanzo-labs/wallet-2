import React from 'react'

import MuiLink from '@material-ui/core/Link'
import Link from 'next/link'

import { withStyles } from '@material-ui/core/styles'

class MyLink extends React.Component {
  render() {
    const { style, classes, href, hrefAs, children, prefetch, ...props } = this.props
    return pug`
      Link(
        href=href
        as=hrefAs
        prefetch
      )
        MuiLink(
          ...props
          className=classes.root
        )
          =children
    `
  }
}

let styles = theme => ({
  root: {
    cursor: 'pointer',
  },
})

export default withStyles(styles)(MyLink)
