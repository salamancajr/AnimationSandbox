// @flow
import * as React from "react";
import {
  View, StyleSheet, ScrollView, SafeAreaView,
} from "react-native";

import StoryThumbnail from "./StoryThumbnail";
import StoryModal from './StoryModal';

export default class Discovery extends React.PureComponent{
  state = {
    selectedStory: null,
    position: null,
  }

  constructor(props) {
    super(props)
    this.thumbnails = props.stories.map(() => React.createRef())
  }

  selectStory = async (selectedStory, index) => {
    const position = await this.thumbnails[index].current.measure()
    this.setState({ selectedStory, position })
    console.log('pos',position)
  }

  onRequestClose = () => {
    this.setState({
      position: null,
      selectedStory: null
    })
  }

  render() {
    const {onRequestClose} = this
    const { stories } = this.props
    const { selectedStory, position } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            style={styles.content}
          >
            {stories.map((story, index) => (
              <StoryThumbnail
                ref={this.thumbnails[index]}
                onPress={() => this.selectStory(story, index)}
                key={story.id}
                selected={selectedStory && selectedStory.id === story.id}
                {...{ story }}
              />)
            )}
          </View>
        </ScrollView>
        {selectedStory && (
          <StoryModal story={selectedStory} {...{position, onRequestClose}}/>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
});
