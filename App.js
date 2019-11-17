import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import SharedElements from './src/screens/SharedElements'
import Login from './src/screens/Login'
import Discovery from './src/screens/Discovery'
import MonzoCard from './src/screens/MonzoCard'
import BBC from './src/screens/BBC'
import LiquidSwipe from './src/screens/LiquidSwipe'
import Chrome from './src/screens/Chrome'
import SkyFall from './src/screens/SkyFall'

console.ignoredYellowBox = ['Warning: `-[RCTRootView cancelTouches]`'];
console.disableYellowBox = true;

const App = createStackNavigator({
  Login: { screen: Login, navigationOptions: {
    header: null
  } },
  SharedElements: { screen: SharedElements, navigationOptions: {
    header: null
  } },
  Discovery: { screen: Discovery, navigationOptions: {
    header: null
  } },
  SkyFall: { screen: SkyFall, navigationOptions: {
    header: null
  } },
  BBC: { screen: BBC, navigationOptions: {
    header: null
  } },
  Chrome: { screen: Chrome, navigationOptions: {
    header: null
  } }
})

export default createAppContainer(App)
