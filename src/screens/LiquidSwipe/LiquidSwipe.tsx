import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { PanGestureHandler, State } from "react-native-gesture-handler";
import { onGestureEvent, snapPoint } from "react-native-redash";
import Weave from "./Weave";
import {
  initialSideWidth,
  initialWaveCenter,
  sideWidth,
  waveHorRadius,
  waveHorRadiusBack,
  waveVertRadius
} from "./WeaveHelpers";
import Content, { ContentProps } from "./Content";
import Button from "./Button";

export const assets = [
  require("./assets/firstPageImage.png"),
  require("./assets/secondPageImage.png")
];

import { followPointer, snapProgress } from './AnimationHelpers'
const front: ContentProps = {
  backgroundColor: "#4d1168",
  source: assets[1],
  title1: "For",
  title2: "Gamers",
  color: "#fd5587"
};

const back: ContentProps = {
  backgroundColor: "white",
  source: assets[0],
  title1: "Online",
  title2: "Gambling",
  color: "black"
};

const { width } = Dimensions.get("window");
const maxWidth = width -15

const { Value, cond, multiply, divide, interpolate } = Animated;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default () => {
  const isBack = new Value(0)
  const y = new Value(initialWaveCenter)
  const state = new Value(State.UNDETERMINED)
  const translationX = new Value(0)
  const velocityX = new Value(0)
  const gestureHandler = onGestureEvent({ y, state, translationX, velocityX })

  const centerY = followPointer(y)
  const gestureProgress = cond(isBack, interpolate(translationX, {
    inputRange: [0, maxWidth],
    outputRange: [1, 0]
  }),
  interpolate(translationX, {
    inputRange: [-maxWidth, 0],
    outputRange: [0.4, 0]
  })
  );
  const progress = snapProgress(
    gestureProgress,
    state,
    isBack,
    snapPoint(gestureProgress, divide(velocityX, multiply(-maxWidth, cond(isBack, 1, 0.4))), [0,1])
  )
  const horRadius = cond(
    isBack,
    waveHorRadiusBack(progress),
    waveHorRadius(progress)
  )
  const vertRadius = waveVertRadius(progress);
  const sWidth = sideWidth(progress);
  return (
    <View style={styles.container}>
      <Content {...back} />
      <PanGestureHandler {...gestureHandler}>
        <Animated.View style={StyleSheet.absoluteFill}>
          <Weave sideWidth={sWidth} {...{ centerY, horRadius, vertRadius }}>
            <Content {...front}/>
          </Weave>
          <Button x={sWidth} {...{y: centerY, progress }} />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
