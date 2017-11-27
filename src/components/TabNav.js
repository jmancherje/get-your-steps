import React from 'react';
import { StyleSheet } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Foundation } from '@expo/vector-icons';

import Root from './Root';
import RoutePlanningViewContainer from '../containers/RoutePlanningViewContainer';
import SavedRoutesContainer from '../containers/SavedRoutesContainer';

const Tabs = TabNavigator({
  SavedRoutes: {
    screen: SavedRoutesContainer,
    navigationOptions: {
      tabBarLabel: 'All Routes',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="marker" />),
    },
  },
  PlanRoute: {
    screen: RoutePlanningViewContainer,
    navigationOptions: {
      tabBarLabel: 'New Route',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="marker" />),
    },
  },
  Steps: {
    screen: Root,
    navigationOptions: {
      tabBarLabel: 'Steps',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="foot" />),
    },
  },
}, {
  animationEnabled: true,
  initialRouteName: 'PlanRoute',
  tabBarOptions: {
    labelStyle: {
      fontSize: 16,
    },
    activeBackgroundColor: '#CEE1F8',
  },
});

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
  },
});

export default Tabs;
