import React from 'react';
import { StyleSheet } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Foundation } from '@expo/vector-icons';

import Root from './Root';
import RoutePlanningViewContainer from '../containers/RoutePlanningViewContainer';

const Tabs = TabNavigator({
  Location: {
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
  Data: {
    screen: RoutePlanningViewContainer,
    navigationOptions: {
      tabBarLabel: 'All Routes',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="marker" />),
    },
  },
}, {
  animationEnabled: true,
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
