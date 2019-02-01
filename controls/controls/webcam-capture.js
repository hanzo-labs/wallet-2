import React from 'react'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import Webcam from 'react-webcam'

import control from './control'
import { withStyles } from '@material-ui/core/styles'

@control
class WebcamCapture extends React.Component {
  static defaultProps = {
    screenshotFormat: 'image/jpeg',
    videoConstraints: {
      width: 1280,
      height: 720,
      facingMode: 'user',
    },
    screenshotQuality: .7,
    audio: false,
    height: 'auto',
    width: 'auto',
    instructions: 'Take a photo',
    showErrors: true,
  }

  constructor(props) {
    super(props)

    this.state = {
      opened: false,
    }
  }

  setRef = webcam => {
    this.webcam = webcam
  }

  capture = () => {
    this.props.onChange(this.webcam.getScreenshot())

    this.close()
  }

  open = () => {
    this.setState({ opened: true })
  }

  close = () => {
    this.setState({ opened: false })
  }

  render() {
    let {
      videoContraints,
      classes,
      onChange,
      value,
      errorMessage,
      showErrors,
      ...props
    } = this.props

    let videoConstraints = Object.assign({
      width: 1280,
      height: 720,
      facingMode: 'user'
    }, videoConstraints || {})

    return pug`
      .webcam-capture
        if value
          Button(
            className=classes.button
            onClick=this.open
          )
            img(src=value)
        else
          IconButton(
            className=classes.button
            onClick=this.open
          )
            PhotoCamera(style={ fontSize: 200 })
        if !!errorMessage && showErrors
          .error
            = errorMessage
        Dialog(
          open=this.state.opened
          onClose=this.close
        )
          DialogTitle
            =props.instructions
          DialogContent
            Webcam(
              ...props
              ref=this.setRef
              videoConstraints=videoConstraints
            )
          DialogActions
            Button(onClick=this.capture)
              | SAVE PHOTO
    `
  }
}

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    cursor: 'pointer',
  },

})

export default withStyles(styles)(WebcamCapture)

