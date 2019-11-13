import React from 'react'
import { View, ScrollView, TouchableWithoutFeedback, Animated, Image, Dimensions, SafeAreaView, StyleSheet, Text } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('screen').width
const SCREEN_HEIGHT = Dimensions.get('screen').height

const images = [
  { id: 1, src: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80' },
  { id: 2, src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80' },
  { id: 3, src: 'https://images.unsplash.com/photo-1540206395-68808572332f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=581&q=80' },
  { id: 4, src: 'https://images.unsplash.com/photo-1439853949127-fa647821eba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80' },
]

export default class SharedElements extends React.Component {

  constructor() {
    super()
    this.state = {
      activeImage: null
    }
  }

  allImages = {}
  oldPosition = {}
  position = new Animated.ValueXY()
  dimensions = new Animated.ValueXY()
  animation = new Animated.Value(0)
  activeImageStyle = null


  openImage = (index) => {
    this.allImages[index].measure((x, y, width, height, pageX, pageY) => {
      this.oldPosition.x = pageX
      this.oldPosition.y = pageY
      this.oldPosition.width = width
      this.oldPosition.height = height

      this.position.setValue({
        x: pageX,
        y: pageY
      })
      this.dimensions.setValue({
        x: width,
        y: height
      })
      this.setState({ activeImage: images[index]}, () => {
        this.viewImage.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {
          Animated.parallel([
            Animated.timing(this.position.x, {
              toValue: dPageX,
              duration: 300,
            }),
            Animated.timing(this.position.y, {
              toValue: dPageY,
              duration: 300
            }),
            Animated.timing(this.dimensions.x, {
              toValue: dWidth,
              duration: 300
            }),
            Animated.timing(this.dimensions.y, {
              toValue: dHeight,
              duration: 300
            }),
            Animated.timing(this.animation, {
              toValue: 1,
              duration: 300
            }),
          ]).start()
        })
      })
    })
  }

  closeImage = () => {
    Animated.parallel([
      Animated.timing(this.position.x, {
        toValue: this.oldPosition.x,
        duration: 300
      }),
      Animated.timing(this.position.y, {
        toValue: this.oldPosition.y,
        duration: 300
      }),
      Animated.timing(this.dimensions.x, {
        toValue: this.oldPosition.width,
        duration: 300
      }),
      Animated.timing(this.dimensions.y, {
        toValue: this.oldPosition.height,
        duration: 300
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 300
      }),
    ]).start(() => {
      this.setState({ activeImage: null })
    })
  }

  render() {


    const animatedContentY = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [ -150, 0]
    })

    const animatedContentOpacity = this.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 1],
    })

    const animatedBorderRadius = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    })

    const animatedContentStyle = {
      opacity: animatedContentOpacity,
      transform: [{
        translateY: animatedContentY,
      }]
    }

    const animatedCrossOpacity = {
      opacity: this.animation
    }

    const activeImageStyle = {
      width: this.dimensions.x,
      height: this.dimensions.y,
      left: this.position.x,
      top: this.position.y,
      borderRadius: animatedBorderRadius,
    }
    return (
      <SafeAreaView style={{ flex: 1}}>
      <ScrollView style={{ flex: 1 }}>
        {images.map((image, index) => {
          return (
            <TouchableWithoutFeedback
              onPress={() => this.openImage(index)}
              key={image.id}
            >
              <Animated.View style={{ height: SCREEN_HEIGHT -150, width: SCREEN_WIDTH, padding: 15 }}>
                <Image ref={ref => (this.allImages[index] = ref)} source={{ uri: image.src }} style={{ flex:1, width: undefined, height: undefined, resizeMode: 'cover', borderRadius: 20}} />
              </Animated.View>
            </TouchableWithoutFeedback>
          )
        })}
      </ScrollView>
      <View style={StyleSheet.absoluteFill} pointerEvents={this.state.activeImage ? 'auto' : 'none'}>
        <View ref={ref => this.viewImage = ref} style={{ flex:2, zIndex: 1001 }}>

          {this.state.activeImage && (<Animated.Image style={[{ resizeMode: 'cover', left:0, right:0,top:0, height: null }, activeImageStyle]} source={{ uri: this.state.activeImage.src }} />)}
          <TouchableWithoutFeedback onPress={this.closeImage}>
            <Animated.View style={[{position: 'absolute', top: 30, right: 30}, animatedCrossOpacity]}>
              <Text style={{ fontSize:24, fontWeight: 'bold', color:'white' }}>
                X
              </Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
        <Animated.View style={[{ flex:1, zIndex:1000, backgroundColor: 'white', padding: 20, paddingTop: 50 }, animatedContentStyle]}>
          <Text style={{ fontSize: 24, paddingBottom: 10}}>
            George Salamanca
          </Text>
          <Text>Eu exercitation irure aliquip magna id qui minim id dolor ipsum duis commodo. Quis esse commodo ea eiusmod fugiat officia occaecat incididunt amet in occaecat. Nisi irure in incididunt quis enim ipsum quis tempor do id mollit Lorem ut dolore. Laboris laborum reprehenderit incididunt non et. Aliqua id fugiat nostrud do nostrud ullamco ut incididunt laboris mollit laborum enim enim.</Text>
        </Animated.View>
      </View>
      </SafeAreaView>

    )
  }
}