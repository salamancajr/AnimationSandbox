import React, { useMemo } from "react";
import {
    View,
    Dimensions,
} from "react-native";
import Svg, { Path,  } from "react-native-svg";
import Animated, { Easing } from "react-native-reanimated";
import { onGestureEvent, withOffset, interpolateColor, loop } from "react-native-redash";

const { width, height } = Dimensions.get('screen')
const { stopClock, startClock, cond, eq, Value, interpolate, block, proc, set, Clock, multiply, timing, useCode } = Animated
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const cloud = <Path d="M 25,60
a 20,20 1 0,0 0,40
h 50
a 20,20 1 0,0 0,-40
a 10,10 1 0,0 -15,-10
a 15,15 1 0,0 -35,10
z"/>

export default class Cloud extends React.Component{
  progress = new Value(0)
  cloudTranslate = interpolate(this.progress, {
    inputRange: [0, 1],
    outputRange: [0, multiply((width + 100) * -1)]
  })
  render() {
    const cloudTranslate = new Value(0)
    const cloudY = new Value(Math.random() * height)
    const clock = new Clock()
    const state = {
      position: cloudTranslate,//from or origin
      finished: new Value(0),
      time: new Value(0),
      frameTime: new Value(0),
    }

    const config = {
      toValue: multiply((width + 100) * -1),
      duration: Math.max(4000, Math.random() * 8000),
      easing: Easing.linear,
    }
    return (
      <View style={{ zIndex: this.props.index % 2 === 0 ? 0 : 1}}>
        <Animated.Code>
        {() =>
          block([
            startClock(clock),
            timing(clock, state, config),
            cond(eq(state.finished, 1), [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.frameTime, 0),
            set(state.position, 0),
            timing(clock, state, config)
         ]),
        ])}
        </Animated.Code>
        <AnimatedSvg
          height={100}
          width={100}
          fill="white"
          style={{
            top: cloudY,
            position: 'absolute',
            elevation: Math.max(Math.random() * 6, 3),
            left: width,
            transform:[
              { translateX: cloudTranslate },
              {scale:Math.max(Math.random() * 2, 1.4)}
            ]
          }}>
          {cloud}
        </AnimatedSvg>
      </View>

    )
  }
}