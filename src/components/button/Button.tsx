import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './Button.style';

export default (props: {onPress: ()=>{}, addStyle: Object, text: String}) => (
    <TouchableOpacity
        style={[styles.mainButton, props.addStyle]}
        onPress={props.onPress}
    >
        <Text style={styles.text}>
            {props.text}
        </Text>

    </TouchableOpacity>
);
