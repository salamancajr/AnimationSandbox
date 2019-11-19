import { StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';


const grey = 'grey';

export default StyleSheet.create({
    mainButton: {
        width: '90%',
        height: verticalScale(35),
        borderRadius: 1,
        shadowColor: grey,
        alignSelf: 'center',
        shadowOffset: { width: 3, height: 0 },
        shadowRadius: 3,
        elevation: 2,
        shadowOpacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    text: {
        fontSize: verticalScale(12),
        color: 'white',
    },
});
