import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CheckCircleOutlined from '@material-ui/icons/CheckCircleOutlined'

import control from './control'

import { withStyles } from '@material-ui/core/styles'

@control
class MUIListPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = { value: props.value }
  }
  render() {
    let { options, classes, showErrors, errorMessage, ...props} = this.props
    let state = this.state

    options = options || []

    let items = []

    for (let k in options) {
      ((key) => {
        let option = options[key]
        let Icon = option.icon

        items.push(pug`
          ListItem(
            button
            classes={ selected: classes.selected }
            selected=( props.value === key )
            onClick=() => { props.onChange(key) }
            key=key
          )
            if option.icon
              ListItemIcon(className=classes.noMargin)
                Icon(style={ fontSize: 36 })
            ListItemText(
              primary=(option.primary || option.label)
              secondary=(option.secondary || option.subLabel)
              className=classes.listItemText
            )
            if props.value === key
              ListItemIcon
                CheckCircleOutlined(style={ fontSize: 36 })
        `)
      })(k)
    }

    return pug`
      .list-picker(className=classes.root)
        List
          = items
          = props.children
        if !!errorMessage && showErrors
          .error
            = errorMessage
    `
  }
}

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

export default withStyles(styles)(MUIListPicker)
