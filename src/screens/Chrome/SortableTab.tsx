import React from "react";
import { View } from "react-native";
import Tab, { TAB_SIZE, TabProps } from "./Tab";
import Animated, { Easing } from 'react-native-reanimated'
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { panGestureHandler } from "react-native-redash";

const { max, not, neq, clockRunning, Value, add, cond, eq, block, set, useCode, multiply, floor, divide, and, Clock, timing, stopClock, startClock } = Animated

const withSnap = ({
  value,/*value we'll be animating*/
  offset,/*current offset when stationed*/
  state: gestureState
}) => {
  const clock = new Clock()
  const state = {
    position: new Value(0),//from or origin
    finished: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  }
  const config = {
    toValue: new Value(0),
    duration: 250,
    easing: Easing.linear,
  }
  const position = new Value(0)// where we need to animate from

  const safeOffset = new Value(0) //gesture when active, adding translation - like withOffset
  return block([
    cond(
      eq(gestureState, State.ACTIVE), set(position, value)),// memorizing value - translateX and translateY
    cond(and(neq(gestureState, State.ACTIVE), not(clockRunning(clock))), [
      set(config.toValue, offset),/*go back to current offset when stationed if gesture not active*/
      set(state.position, add(safeOffset, position)),
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      startClock(clock),
      set(position, 0)
    ]),
    cond(clockRunning(clock), [
      timing(clock, state, config),
      cond(eq(state.finished, 1), [
        set(safeOffset, state.position),
        stopClock(clock)
      ]),
      state.position
    ], [
      add(safeOffset, value)
    ]),
  ])
}
interface SortableCardProps extends TabProps {
  index: number;
}

export default ({ tab, oldOffsets, index }: SortableCardProps) => {

  const {
    gestureHandler,
    state,
    translationX,
    translationY,
  } = panGestureHandler()
  const zIndex = cond(eq(state, State.ACTIVE), 10, 1)
  const thisOldOffset = oldOffsets[index]
  const translateX = withSnap({
    value: translationX,
    offset: thisOldOffset.x,
    state,
  })
  const translateY = withSnap({
    value: translationY,
    offset: thisOldOffset.y,
    state,
  })
  const closestOffsetX = multiply(max(floor(divide(translateX, TAB_SIZE)), 0),TAB_SIZE)
  const closestOffsetY = multiply(max(floor(divide(translateY, TAB_SIZE)), 0),TAB_SIZE)

  useCode(block([
    oldOffsets.map(oldOffset => cond(
      and(
        eq(closestOffsetX, oldOffset.x),
        eq(closestOffsetY, oldOffset.y),
        eq(state, State.ACTIVE)
        ), [
          set(oldOffset.x, thisOldOffset.x),
          set(oldOffset.y, thisOldOffset.y),
          set(thisOldOffset.x, closestOffsetX),
          set(thisOldOffset.y, closestOffsetY),

        ]))
  ]), [])
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: TAB_SIZE,
          height: TAB_SIZE,
          justifyContent: "center",
          alignItems: "center",
          zIndex,
          transform: [{
            translateX
          }, {
            translateY,
          }]
        }}
      >
      <Tab {...{ tab }} />
    </Animated.View>
    </PanGestureHandler>

  );
};
