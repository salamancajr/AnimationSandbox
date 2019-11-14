import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, Animated, TouchableWithoutFeedback,
} from 'react-native';
import styles from './Menu.style';
import Button from '../../components/button/Button.tsx';

class Menu extends Component {
  state = {
      animation: new Animated.Value(1),
  }

  static navigationOptions = {
      header: null,
  }

  componentDidMount() {

  }

  startAnimation = () => {
      Animated.timing(this.state.animation, {
          toValue: 0,
          duration: 500,
      }).start();
  }


  render() {
      const animatedStyle = {
          opacity: this.state.animation,
      };

      return (
          <SafeAreaView style={styles.container}>
              <TouchableWithoutFeedback onPress={this.startAnimation}>
                  <Animated.View style={[styles.box, animatedStyle]}>


                  </Animated.View>
              </TouchableWithoutFeedback>

          </SafeAreaView>


      );
  }
}

export default Menu;
