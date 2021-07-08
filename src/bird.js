// Import dependencies
import {Finger, FingerCurl, FingerDirection, GestureDescription} from 'fingerpose'; 

// Define Gesture Description
export const birdGesture = new GestureDescription('flip_off'); 


birdGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)
birdGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, 0.75);
for(let finger of [Finger.Index,Finger.Pinky,Finger.Thumb, Finger.Ring]){
    birdGesture.addCurl(finger, FingerCurl.FullCurl, .85); 
   //  birdGesture.addDirection(finger, FingerDirection.VerticalDown, 0.25);
}

