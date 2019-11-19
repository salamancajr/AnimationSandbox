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

              <Button text={"Animated Login Screen"} onPress={() => this.props.navigation.navigate('Login')} />
              <Button text={"Liquid Swipe"} onPress={() => this.props.navigation.navigate('LiquidSwipe')} />
              <Button text={"BBC Player"} onPress={() => this.props.navigation.navigate('BBC')} />
              <Button text={"Snapchat Discovery"} onPress={() => this.props.navigation.navigate('Discovery')} />
              <Button text={"Monzo Card Selection"} onPress={() => this.props.navigation.navigate('MonzoCard')} />
              <Button text={"Shared Elements"} onPress={() => this.props.navigation.navigate('SharedElements')} />
              <Button text={"Chrome"} onPress={() => this.props.navigation.navigate('Chrome')} />
              <Button text={"SkyFall"} onPress={() => this.props.navigation.navigate('SkyFall')} />

          </SafeAreaView>


      );
  }
}

export default Menu;
