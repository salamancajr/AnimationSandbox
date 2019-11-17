import React from 'react';
import { Dimensions } from 'react-native';
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { Easing } from "react-native-reanimated";
import Rocket from './Rocket'
import Cloud from './Cloud'
import Svg, { Path } from "react-native-svg";

import { onGestureEvent, withOffset, interpolateColor, loop } from "react-native-redash";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const cloud = <Path d="M 25,60
a 20,20 1 0,0 0,40
h 50
a 20,20 1 0,0 0,-40
a 10,10 1 0,0 -15,-10
a 15,15 1 0,0 -35,10
z"/>
const { width, height } = Dimensions.get('screen')
const { stopClock, startClock, cond, eq, Value, interpolate, block, proc, set, Clock, multiply, timing, useCode } = Animated

export default class MyMaskedView extends React.Component {
  constructor(props){
    super(props)
    this.cloudY = new Value(Math.random() * height)
    this.cloudY2 = new Value(Math.random() * height)
    //this.cloudTranslate = new Value(0)
    this.translationX = new Value(0)
    this.translationY = new Value(0)
    this.progress = new Value(0);
    this.progress2 = new Value(0);

    this.progressDelay = new Value(0);

    this.rVal = new Value(0)
    const state = new Value(0)
    this.gestureHandler = onGestureEvent({
        translationY: this.translationY,
        translationX: this.translationX,
        state,
    })
    this.state = {
      top: 0
    }
    const from = {
      r: 135,
      g: 206,
      b: 235
    };
    const to = {
      r: 225,
      g: 176,
      b: 68
    };
    this.X = withOffset(this.translationX, state)
    this.Y = withOffset(this.translationY, state)
    this.rValInt = interpolateColor(this.X, {
      inputRange: [0, Dimensions.get('screen').width],
      outputRange: [from, to]
    }

    , "rgb")

    this.opacity1 = interpolate(this.Y, {
      inputRange: [0, Dimensions.get('screen').height],
      outputRange: [0.6, 1]
    })
    this.cloudTranslate = interpolate(this.progress, {
      inputRange: [0, 1],
      outputRange: [0, multiply((width + 100) * -1)]
    })
  }

  render() {
    const { progress, gestureHandler, rValInt, opacity1, cloudTranslate, cloudY } = this

    const clock = new Clock()
    const state = {
      position: this.progress,//from or origin
      finished: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),

    }

    const config = {

      toValue: multiply((width + 100) * -1),
      duration: 6000,
      easing: Easing.linear,
    }
    return (
      <Animated.View style={{flex:1, backgroundColor: rValInt, opacity: opacity1 }}>

      {/* <Animated.Code>
        {() =>
          block([
            //set(progress, loop({ clock, duration: 6000, easing: Easing.linear })),
            timing(clock, state, config),
            // cond(eq(state.finished, 1), [
            // set(state.finished, 0),
            // set(state.time, 0),
            // set(state.frameTime, 0),
            // set(state.position, 0),
            // timing(clock, state, config)
          // ]),
        ])}
        </Animated.Code> */}
        {Array(6).fill().map((_, i) => (
          <Cloud index={i}/>
        ))}
        <PanGestureHandler {...gestureHandler}>

        <AnimatedSvg
          viewBox="0 0 446 415"
          height={100}
          width={100}
          style={{
            left: width / 2 - 50,
            top: height / 2 - 50,
            transform:[
              {scale: 2},
              {translateX: this.X},
              {translateY: this.Y}
            ]
          }}>
            <Rocket />
          </AnimatedSvg>
        </PanGestureHandler>
      </Animated.View>
    );
  }
}