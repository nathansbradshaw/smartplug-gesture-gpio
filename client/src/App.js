import logo from './logo.svg';
import './App.css';
import { Camera } from '@mediapipe/camera_utils/camera_utils';
import { Hands } from '@mediapipe/hands/hands';
import { Control } from '@mediapipe/control_utils/control_utils'
import { drawConnectors, drawLandmarks, HAND_CONNECTIONS } from '@mediapipe/drawing_utils/drawing_utils'
import { useEffect } from 'react';
import { birdGesture } from "./bird"
import { weakBirdGesture } from "./weakBird"
import * as fp from "fingerpose"

function App() {
  const HANDMODE = 0; //0 for right hand, 1 for left hand
  const MAKER_KEY = process.env.REACT_APP_MAKER_KEY // add a .env file with your maker key
  const DELAY = 7;
  let counter = 0;



  useEffect(() => {
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    const canvasCtx = canvasElement.getContext('2d');









    function onResults(results) {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
      if (results.multiHandLandmarks) {
        counter++
        console.log(counter)
        if (results.multiHandLandmarks[HANDMODE] !== undefined && results.multiHandLandmarks[HANDMODE] !== null && counter > DELAY) {
          counter = DELAY + 1; // keep delay above delay unless the event was triggered
          const landmarksObj = results.multiHandLandmarks[HANDMODE]
          const landmarks = []



          for (let i = 0; i < 21; i++) {
            landmarks.push([landmarksObj[i].x * window.outerWidth, landmarksObj[i].y * window.outerHeight, 0])
          }
          // console.log(landmarks)

          const GE = new fp.GestureEstimator([
            fp.Gestures.ThumbsUpGesture,
            birdGesture,
            weakBirdGesture
          ]);

          const gesture = GE.estimate(landmarks, 8.5);
          if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
            console.log(gesture);
            console.log(gesture.gestures);

            const confidence = gesture.gestures.map(
              (prediction) => prediction.confidence
            );
            const maxConfidence = confidence.indexOf(
              Math.max.apply(null, confidence)
            );


            // console.log(gesture.gestures[maxConfidence].name)
            // console.log(maxConfidence)

            
            if ((gesture.gestures[maxConfidence].name === "flip_off" || gesture.gestures[maxConfidence].name === "enoch_flip_off")) {
              console.log("light off")
              const requestOptions = {
                method: 'POST',
                cors: { origin: "*", },
                // headers: {
                //   'Access-Control-Allow-Origin' : '*'
                // }
              };
              counter = 0;
              fetch('https://maker.ifttt.com/trigger/light_off/with/key/' + MAKER_KEY, requestOptions)
                .then(response => console.log(response))

            } else if (gesture.gestures[maxConfidence].name === "thumbs_up") {
              const requestOptions = {
                method: 'POST',
                cors: { origin: "*", },
                // headers: {
                //   'Access-Control-Allow-Origin' : '*'
                // }
              };
              counter = 0;
              fetch('https://maker.ifttt.com/trigger/light_on/with/key/' + MAKER_KEY, requestOptions)
                .then(response => console.log(response))
            }
          }
        }











        for (const landmarks of results.multiHandLandmarks) {
          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
            { color: '#00FF00', lineWidth: 5 });
          drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
      }
      canvasCtx.restore();
    }

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });
    hands.setOptions({
      maxNumHands: 2,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720
    });
    camera.start();








    // Camera.start
  })

  return (
    <div className="App">
      <header className="App-header">
        {/* <Camera/> */}
        <div className="container">
          <video className="input_video"></video>
          <canvas className="output_canvas" width="1280px" height="720px"></canvas>
        </div>

      </header>
    </div>
  );
}

export default App;
