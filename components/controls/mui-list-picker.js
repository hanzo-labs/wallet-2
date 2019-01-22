import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CheckCircleOutlined from '@material-ui/icons/CheckCircleOutlined'

import control from './control'

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  selected: {
    backgroundColor: theme.palette.secondary.main  + ' !important',
  },
  listItemText: {
    flexGrow: 1,
  },
  noMargin: {
    margin: 0,
  },
})

@control
class MuiListPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = { value: props.value }
  }
  render() {
    let { options, classes, ...props} = this.props
    let state = this.state

    options = options || []

    let items = options.map((option) => {
      let Icon = option.icon

      return pug`
        ListItem(
          button
          classes={ selected: classes.selected }
          selected=( props.value === option.value )
          onClick=() => { props.onChange(option.value) }
        )
          if option.icon
            ListItemIcon(className=classes.noMargin)
              Icon(style={ fontSize: 36 })
          ListItemText(primary=option.label className=classes.listItemText)
          if props.value === option.value
            ListItemIcon
              CheckCircleOutlined(style={ fontSize: 36 })
      `
    })

    return pug`
      .list-picker(className=classes.root)
        List
          = items
          = props.children
    `
  }
}

export default withStyles(styles)(MuiListPicker)
