import React, { useState, useMemo, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated, { Easing, Transition, Transitioning } from 'react-native-reanimated'
const {
  multiply,
  Clock,
  Value,
  useCode,
  block,
  cond,
  eq,
  set,
  concat,
  and,
  neq,
  not,
  clockRunning,
  interpolate,
  greaterOrEq,
  add,
 } = Animated

import Card, { CARD_WIDTH, CARD_HEIGHT } from "./Card";
import CheckIcon from "./CheckIcon";
import Thumbnail from "./Thumbnail";
import { bInterpolate, timing as thisTiming, max } from "react-native-redash";

const timingFunc = (animation, clock) => set(animation, thisTiming({
  clock,
  from: 0,
  toValue:1,
  duration: 400,
  easing: Easing.linear
}))
const INITIAL_INDEX = -1;

export default ({ cards }) => {
  const container = useRef()
  const [selectedCardState, setSelectedCardState] = useState(INITIAL_INDEX)
  const { selectedCard, cardRotations, cardTranslations, cardZIndexes, clock, animation, translateX, shouldUpdateZIndex, isGroupingAnimationDone } = useMemo(() => ({
    selectedCard: new Value(INITIAL_INDEX),
    cardRotations: cards.map(() => new Value(0)),
    cardTranslations: cards.map(() => new Value(0)),
    cardZIndexes: cards.map(() => new Value(0)),
    clock: new Clock(),
    animation: new Value(0),
    translateX: new Value(CARD_WIDTH),
    shouldUpdateZIndex: new Value(1),
    isGroupingAnimationDone: new Value(0),
  }), [])

  const selectCard = (index) => {
    container.current.animateNextTransition()
    setSelectedCardState(index)
    selectedCard.setValue(index)
  }

  useCode(block([
    // initial animation to fan out cards
    cond(eq(selectedCard, INITIAL_INDEX), [
      timingFunc(animation, clock),
      set(cardRotations[0], bInterpolate(animation, 0, -15)),
      set(cardRotations[2], bInterpolate(animation, 0, 15))
    ]),
    // animation to bring cards together initially after press
    cond(and(neq(selectedCard, INITIAL_INDEX), not(isGroupingAnimationDone)), [
      timingFunc(animation, clock),
      set(translateX, bInterpolate(animation, translateX, 0)),
      set(cardRotations[0], bInterpolate(animation, cardRotations[0], -7.5)),
      set(cardRotations[1], bInterpolate(animation, cardRotations[1], 7.5)),
      set(cardRotations[2], bInterpolate(animation, cardRotations[2], 0)),

      cond(not(clockRunning(clock)), set(isGroupingAnimationDone, 1)),
    ]),

    ...cards.map((card, index) =>
      cond(and(eq(selectedCard, index), isGroupingAnimationDone), [
        timingFunc(animation, clock),

        // animation to slightly rotate cards not selected
        ...cards.map((_card, i) => i).filter((_card, i) => index !== i).map((absoluteIndex, i) =>
        set(cardRotations[absoluteIndex],
          bInterpolate(animation, cardRotations[absoluteIndex], 7.5 * (i % 2 === 0 ? -1 : 1)))),

        // animation to rotate selected card
        set(cardRotations[index], interpolate(animation, {
          inputRange: [0, 0.5, 1],
          outputRange: [0, 45, 0]
        })),

        // animation to raise selected card
        set(cardTranslations[index], interpolate(animation, {
          inputRange: [0, 0.5, 1],
          outputRange: [0, -CARD_HEIGHT * 1.5, 1]
        })),

      // update Z index halfway through animation
      cond(and(greaterOrEq(animation, 0.5), shouldUpdateZIndex), [
        set(cardZIndexes[index], add(max(...cardZIndexes), 1)),
        set(shouldUpdateZIndex, 0)
      ]),
      cond(not(clockRunning(clock)), set(shouldUpdateZIndex, 1))
    ]))
  ]), [cards])

  return (
    <Transitioning.View ref={container} style={styles.container} transition={<Transition.Out interpolation="easeInOut" type="fade" />}>
      <View style={styles.cards}>
        {cards.map((card, index) => {
          const rotateZ = concat(cardRotations[index], 'deg')
          const translateY = cardTranslations[index]
          const elevation = cardZIndexes[index]
          const zIndex = elevation
          return (
            <Animated.View
              key={card.id}
              style={{
                zIndex,
                elevation,
                ...StyleSheet.absoluteFillObject,
                transform: [
                  { translateX: multiply(translateX, -1)},
                  { rotateZ },
                  { translateX },
                  { translateY }
                ]
              }}
            >
              <Card key={card.id} {...{ card }} />
            </Animated.View>
          );
        })}
      </View>
      <SafeAreaView>
        {cards.map(({ id, name, color, thumbnail }, index) => (
          <RectButton key={id} onPress={() => selectCard(index)}>
            <View style={styles.button} accessible>
              <Thumbnail {...{ thumbnail }} />
              <View style={styles.label}>
                <Text>{name}</Text>
              </View>
             {selectedCardState === index && <CheckIcon {...{ color }} />}
            </View>
          </RectButton>
        ))}
      </SafeAreaView>
    </Transitioning.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cards: {
    flex: 1,
    backgroundColor: "#f4f6f3"
  },
  button: {
    flexDirection: "row"
  },
  label: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#f4f6f3",
    justifyContent: "center"
  }
});
