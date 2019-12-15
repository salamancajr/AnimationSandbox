import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import SharedElements from './src/screens/SharedElements'
import Login from './src/screens/Login'
import Menu from './src/screens/menu/Menu'
import Discovery from './src/screens/Discovery'
import MonzoCard from './src/screens/MonzoCard'
import BBC from './src/screens/BBC'
import LiquidSwipe from './src/screens/LiquidSwipe'
import Chrome from './src/screens/Chrome'
import SkyFall from './src/screens/SkyFall'

//console.ignoredYellowBox = ['Warning: `-[RCTRootView cancelTouches]`'];
// console.disableYellowBox = true;

const App = createStackNavigator({
  Menu: { screen: Menu, navigationOptions: {
    header: null
  } },
  Login: { screen: Login, navigationOptions: {
    header: null
  } },
  LiquidSwipe: { screen: LiquidSwipe, navigationOptions: {
    header: null
  } },
  SharedElements: { screen: SharedElements, navigationOptions: {
    header: null
  } },
  Discovery: { screen: Discovery, navigationOptions: {
    header: null
  } },
  MonzoCard: { screen: MonzoCard, navigationOptions: {
    header: null
  } },
  BBC: { screen: BBC, navigationOptions: {
    header: null
  } },
  Chrome: { screen: Chrome, navigationOptions: {
    header: null
  } },
  SkyFall: { screen: SkyFall, navigationOptions: {
    header: null
  } }
})

export default createAppContainer(App)
