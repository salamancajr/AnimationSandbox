import React, { useMemo } from "react";
import {
    View,
    Text,
    StyleSheet
} from "react-native";
import Animated from 'react-native-reanimated'
import { PanGestureHandler, State } from "react-native-gesture-handler";
import runSpring from '../../../utils/animations'
import { onGestureEvent, withOffset, snapPoint } from "react-native-redash";


const {
    Clock,
    Value,
    diff,
    modulo,
    divide,
    useCode,
    sub,
    block,
    set,
    cond,
    eq,
    stopClock,
    not,
    clockRunning,
    ceil,
    floor,
} = Animated


const PanGesture = ({ index, ratio, length }) => {
    const clock = new Clock()
    const shouldSnap = new Value(0)
    const state = new Value(State.UNDETERMINED)
    const translationX = new Value(0)
    const velocityX = new Value(0);
    const gestureEvent = onGestureEvent({
        state,
        translationX,
        velocityX
    })
    const { translateX } = useMemo(() => ({
        translateX: withOffset(translationX, state)
    }), [translationX, state])
    const increment = divide(diff(translateX), ratio)
    const setIndex = value => set(index, modulo(value, length))


    useCode(block([
        setIndex(sub(index, increment)),
        cond(eq(state, State.BEGAN), stopClock(clock)),
        cond(eq(state, State.END), [
            set(state, State.UNDETERMINED),
            set(shouldSnap, 1)
        ]),
        cond(eq(shouldSnap, 1), [
            setIndex(
                runSpring({
                    clock,
                    value: index,
                    dest:snapPoint(index,
                        divide(velocityX, -ratio), [
                            ceil(index), floor(index)
                        ])
            })),
            cond(not(clockRunning(clock)), set(shouldSnap, 0))
        ])
    ]), [])
    return (
        <PanGestureHandler {...gestureEvent}>
            <Animated.View style={StyleSheet.absoluteFill}/>
        </PanGestureHandler>
    )
}

export default PanGesture;
