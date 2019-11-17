import React from "react";
import { StyleSheet, View } from "react-native";
import { tabs, TAB_SIZE, TAB_COLUMNS } from "./Tab";
import SortableTab from "./SortableTab";
import Animated from 'react-native-reanimated'
const { Value } = Animated

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1d1e"
  }
});
export default () => {
  const oldOffsets = tabs.map((_, index) => ({
    x: new Value(index % TAB_COLUMNS === 0 ? 0 : TAB_SIZE),
    y: new Value(Math.floor(index / TAB_COLUMNS) * TAB_SIZE),
  }))
  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <SortableTab key={tab.id} {...{ tab, oldOffsets, index }} />
      ))}
    </View>
  );
};
