import { TabNavigator } from 'react-navigation';
import Root from './Root';

const Tabs = TabNavigator({
  Steps: {
    screen: Root,
    navigationOptions: {
      tabBarLabel: 'Steps',
    },
  },
  Location: {
    screen: Root,
    navigationOptions: {
      tabBarLabel: 'Location',
    },
  },
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: '#e91e63',
    labelStyle: {
      fontSize: 14,
    },
  },
});

export default Tabs;
