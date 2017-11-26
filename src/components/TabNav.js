import { TabNavigator } from 'react-navigation';

import Root from './Root';
import RoutePlanningViewContainer from '../containers/RoutePlanningViewContainer';

const Tabs = TabNavigator({
  Location: {
    screen: RoutePlanningViewContainer,
    navigationOptions: {
      tabBarLabel: 'Location',
    },
  },
  Steps: {
    screen: Root,
    navigationOptions: {
      tabBarLabel: 'Steps',
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
