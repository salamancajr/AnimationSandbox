import React from 'react';
import { MaskedViewIOS, View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Circle } from "react-native-svg";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { Easing } from "react-native-reanimated";

import { timing, onGestureEvent, withOffset, interpolateColor, loop } from "react-native-redash";

const { width, height } = Dimensions.get('screen')
const { Value, interpolate, block, set, Clock, multiply } = Animated
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export default class MyMaskedView extends React.Component {
  constructor(props){
    super(props)
    this.cloudY = new Value(10)
    this.cloudY2 = new Value(10)

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
    this.cloudTranslate2 = interpolate(this.progress2, {
      inputRange: [0, 1],
      outputRange: [0, multiply((width + 100) * -1)]
    })
  }
  randomize = () => {
    return Math.random() * height
  }

  render() {
    const clock = new Clock()
    const { gestureHandler, rValInt, opacity1, cloudTranslate, progress, cloudY, cloudTranslate2, progress2 } = this
    const cloud = <Path d="M 25,60
    a 20,20 1 0,0 0,40
    h 50
    a 20,20 1 0,0 0,-40
    a 10,10 1 0,0 -15,-10
    a 15,15 1 0,0 -35,10
    z"/>


    return (
      <Animated.View style={{flex:1, backgroundColor: rValInt, opacity: opacity1 }}>
        <Animated.Code>
          {() => block([
            set(progress, loop({ clock, duration: 4000, easing: Easing.linear})),
            set(progress2, loop({ clock, duration: 8000, easing: Easing.linear})),
          ])}
        </Animated.Code>
        <AnimatedSvg
          height={100}
          width={100}
          fill="white"
          style={{
            position: 'absolute',
            top: 40,
            left: width,
            transform:[
              {translateX: cloudTranslate},
            ]
          }}>
            {cloud}
          </AnimatedSvg>
          <AnimatedSvg
          height={100}
          width={100}
          fill="white"
          style={{
            position: 'absolute',
            zIndex:1,
            top: 600,
            left: width,
            transform:[
              {translateX: cloudTranslate2},
              {scale:1.4}
            ]
          }}>
            {cloud}
          </AnimatedSvg>
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
            <Path fill="white" d="M285.863 267.695l38 14 19 84-71-64zM187.863 267.695l-38 14-19 84 71-64z"/>
            <Path fill="red" d="M267.254 328.283c0-16.781-13.606-30.387-30.39-30.387s-30.392 13.606-30.392 30.387c0 16.785 13.61 53.332 30.391 53.332 16.785 0 30.391-36.547 30.391-53.332zm0 0"/>
            <Path fill="orange" d="M251.711 327.424c0-8.2-6.649-14.848-14.848-14.848-8.199 0-14.848 6.648-14.848 14.848 0 8.203 6.65 26.058 14.848 26.058 8.2 0 14.848-17.855 14.848-26.058zm0 0"/>
            <Path fill="yellow" d="M270.893 93.77h.002l-.047-.083a208.352 208.352 0 0 0-3.346-5.955l-.257-.436c-.501-.854-1.009-1.704-1.523-2.55-.079-.13-.156-.26-.236-.39a186.199 186.199 0 0 0-3.585-5.64l-.385-.578c-.499-.747-1.002-1.49-1.51-2.228-.13-.186-.257-.373-.386-.559a163.972 163.972 0 0 0-3.802-5.247c-.175-.231-.351-.46-.527-.69-.491-.643-.987-1.281-1.487-1.915-.18-.227-.359-.456-.54-.682a146.01 146.01 0 0 0-1.998-2.45l-.12-.142c-.63-.751-1.267-1.493-1.91-2.228-.212-.244-.427-.485-.642-.727-.499-.562-1.002-1.12-1.508-1.672-.217-.236-.433-.473-.651-.707-.698-.75-1.401-1.493-2.114-2.222l-.145-.144a120.453 120.453 0 0 0-2.036-2.023c-.23-.224-.461-.444-.692-.665-.534-.51-1.072-1.014-1.614-1.513-.231-.212-.462-.426-.694-.636-.752-.68-1.51-1.352-2.276-2.007-.771.658-1.532 1.334-2.288 2.018-.22.199-.438.401-.657.602-.562.516-1.119 1.038-1.671 1.567-.213.204-.427.406-.638.612a123.126 123.126 0 0 0-4.348 4.444c-.19.203-.377.41-.565.614-.542.59-1.08 1.186-1.612 1.788-.188.21-.375.421-.562.634a142.57 142.57 0 0 0-4.08 4.884c-.162.202-.321.405-.481.608a153.16 153.16 0 0 0-1.55 1.995l-.487.637a163.925 163.925 0 0 0-3.815 5.264c-.133.19-.263.383-.395.574-.5.725-.994 1.454-1.484 2.187l-.42.63c-1.21 1.83-2.389 3.686-3.537 5.564l-.337.556c-.467.77-.93 1.544-1.387 2.322l-.375.64a208.294 208.294 0 0 0-3.246 5.774l-.097.176h.003c-18.17 33.639-27.104 71.588-27.104 90.05 0 27.649 8.878 94.649 19.284 134.138h83.696c10.406-39.49 19.285-106.49 19.285-134.137 0-18.463-8.933-56.412-27.103-90.051z"/>
            <Path fill="blue" d="M188.054 286.572c2.176 11.398 4.528 22.145 6.961 31.387h83.696c2.437-9.242 4.79-19.99 6.961-31.387h-97.618zm0 0"/>
            <G>
              <Circle fill="blue" cx="236.863" cy="173.695" r="37"/>
              <Circle fill="red"cx="236.863" cy="173.695" r="31"/>
          </G>
          </AnimatedSvg>
        </PanGestureHandler>
      </Animated.View>
    );
  }
}