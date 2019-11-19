import React, { useMemo, useState } from "react";
import Animated, { Easing } from 'react-native-reanimated'

const { Value, block, startClock, Clock, cond, eq, timing, set, useCode } = Animated



export default ({ style, children, expand }) => {

    let { animatedHeight } = useMemo(() => ({
        animatedHeight: new Value(0),
    }), [])

    const [height, setHeight] = useState(new Value(0));
    const [done, setDone] = useState(false);
    const clock = new Clock()
    const state = {
        position: animatedHeight,
        finished: new Value(0),
        time: new Value(0),
        frameTime: new Value(0),
    }
    const config = {
        toValue: height,
        duration: 250,
        easing: Easing.linear,
    }

    useCode(block([
        cond(eq(expand, 1), [
            startClock(clock),
            timing(clock, state, config)
       ]),
       cond(eq(expand, 0), [
           set(config.toValue, 0),
        startClock(clock),
        timing(clock, state, config)
   ]),
    ]))

    return (
        <Animated.View onLayout={(e) => {
            if (e.nativeEvent.layout.height && !done) {
                setHeight(new Value(e.nativeEvent.layout.height))
                setDone(true)
            }
            }} style={[style, { height: animatedHeight }]}>
            {children}
        </Animated.View>

    );
}


