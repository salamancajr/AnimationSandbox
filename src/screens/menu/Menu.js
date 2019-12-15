import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, Animated, TouchableWithoutFeedback,
} from 'react-native';
import styles from './Menu.style';
import Button from '../../components/button/Button.tsx';
import AccordionContent from 'react-native-reanimated-collapsible'
import Icon from 'react-native-vector-icons/AntDesign'
import { TouchableOpacity } from 'react-native-gesture-handler';

class Menu extends Component {
  state = {
      animation: new Animated.Value(1),
      expand: false,
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
      const { expand } = this.state
      return (
          <SafeAreaView style={styles.container}>
              <View style={{width:'100%'}}>
                <Button text={"Animated Login Screen"} onPress={() => this.setState({ expand: expand ? false : true })} />
                <AccordionContent expand={expand} style={{ overflow:'hidden', width:'90%', alignSelf:'center'}}>
                    <View style={{ paddingVertical:10, alignItems: 'center', justifyContent: 'center'}}>
                        <Text>
                            Do ut fugiat labore proident consequat labore laborum proident dolor nostrud. Reprehenderit sit labore dolor dolore. Exercitation ex duis commodo voluptate sint excepteur incididunt duis do ipsum. Dolor laborum labore ad nisi ut sit fugiat consequat.
                        </Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                        <Icon name="forward" size={30}/>

                        </TouchableOpacity>
                    </View>
                </AccordionContent>
              </View>
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
