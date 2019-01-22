import React from 'react'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'

export default class TokenCard extends React.Component {
  render() {
    let props = this.props

    return pug `
      Card.token-card
        CardActionArea
          CardContent.token-card-content
            h6.token-symbol
              = props.symbol
            h1.token-count
              = props.count
            h6.token-name
              = props.name
          CardContent.token-card-content
            h6.token-value
              =props.value
    `
  }
}
