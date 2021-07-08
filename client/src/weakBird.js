// Import dependencies
import { Finger, FingerCurl, FingerDirection, GestureDescription } from 'fingerpose';

// Define Gesture Description
export const weakBirdGesture = new GestureDescription('enoch_flip_off');


weakBirdGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0)
weakBirdGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);

weakBirdGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 1.0)


for (let finger of [Finger.Index, Finger.Pinky, Finger.Ring]) {
    weakBirdGesture.addCurl(finger, FingerCurl.FullCurl, .95);
    //  birdGesture.addDirection(finger, FingerDirection.VerticalDown, 0.25);
}

