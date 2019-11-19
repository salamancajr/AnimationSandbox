import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
} from "react-native";
import Animated from 'react-native-reanimated'
import runSpring from "../../../utils/animations";
import { PanGestureHandler, State } from 'react-native-gesture-handler'

const { Value, block, cond, eq, event, and, lessOrEq, greaterThan, call, set, interpolate } = Animated
const { width: wWidth, height: wHeight} = Dimensions.get('screen')
class StoryModal extends Component {
    constructor(props) {
        super(props)
        const { x, y, width, height } = props.position
        this.state = {
            isLoaded: false
        }
        this.translateX = new Value(x)
        this.translateY = new Value(y)
        this.width = new Value(width)
        this.height = new Value(height)
        this.velocityY = new Value(0)
        this.animationState = new Value(State.UNDETERMINED)
        this.onGestureEvent = event([{ nativeEvent: {
            translationX: this.translateX,
            translationY: this.translateY,
            velocityY: this.velocityY,
            state: this.animationState,
        }}], { useNativeDriver: true })
    }

    runSpringAlt = (value, destination) => runSpring({ value, dest: destination })

    render() {
        const { translateX, translateY, width, height, onGestureEvent } = this
        const { story, onRequestClose } = this.props;
        const style = {
            ...StyleSheet.absoluteFillObject,
            width,
            height,
            transform: [
                {translateX},
                {translateY}
            ],
        }
        return (
            <View style={styles.container}>
                <Animated.Code>
                    {() => block([
                        cond(eq(this.animationState, State.UNDETERMINED), this.runSpringAlt(translateX, 0)),
                        cond(eq(this.animationState, State.UNDETERMINED), this.runSpringAlt(translateY, 0)),
                        cond(eq(this.animationState, State.UNDETERMINED), this.runSpringAlt(width, wWidth)),
                        cond(eq(this.animationState, State.UNDETERMINED), this.runSpringAlt(height, wHeight)),
                        cond(and(eq(this.animationState, State.END), lessOrEq(this.velocityY, 0)), block([
                            this.runSpringAlt(translateX, 0),
                            this.runSpringAlt(translateY, 0),
                            this.runSpringAlt(width, wWidth),
                            this.runSpringAlt(height, wHeight),
                        ])),
                        cond(and(eq(this.animationState, State.END), greaterThan(this.velocityY, 0)), block([
                            this.runSpringAlt(translateX, this.props.position.x),
                            this.runSpringAlt(translateY, this.props.position.y),
                            this.runSpringAlt(width, this.props.position.width),
                            this.runSpringAlt(height, this.props.position.height),
                            cond(eq(height, this.props.position.height), call([], onRequestClose))
                        ])),
                        cond(eq(this.animationState, State.ACTIVE), set(this.height, interpolate(this.translateY, {
                            inputRange: [0, wHeight],
                            outputRange: [wHeight, this.props.position.height]
                        }))),
                        cond(eq(this.animationState, State.ACTIVE), set(this.width, interpolate(this.translateY, {
                            inputRange: [0, wHeight],
                            outputRange: [wWidth, this.props.position.width]
                        })))
                    ])}
                </Animated.Code>
                <PanGestureHandler
                    activeOffsetY={100}
                    onHandlerStateChange={onGestureEvent}
                    {...{onGestureEvent}}
                >
                    <Animated.View {...{ style }}>
                        <Image onLoadEnd={()=>this.setState({ isLoaded: true })} source={story.source} style={styles.image} />
                    </Animated.View>
                </PanGestureHandler>

            </View>
        );
    }
}
export default StoryModal;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    image: {
        height:null,
        width: null,
        ...StyleSheet.absoluteFillObject,
        borderRadius: 5,
    }
});