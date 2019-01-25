import React from 'react'

import Webcam from 'react-webcam'
import control from './control'

@control
export default class WebcamCapture extends React.Component {
  constructor(props) {
    super(props)
  }

  setRef = webcam => {
    this.webcam = webcam;
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
  };

  render() {
    const videoConstraints = {
      width: 640,
      height: 480,
      facingMode: "user"
    };

    return (
      <div>
        <Webcam
          audio={false}
          height={300}
          width={300}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
        <button onClick={this.capture}>Capture photo</button>
      </div>
    );
  }
}
