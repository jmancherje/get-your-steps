import React from 'react';

import { StyleSheet } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Foundation } from '@expo/vector-icons';

import Root from './Root';
import DirectionsContainer from '../containers/DirectionsContainer';
import SavedRoutesContainer from '../containers/SavedRoutesContainer';
import SaveRouteFormContainer from '../containers/SaveRouteFormContainer';



const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
  },
});

const Stack = StackNavigator({
  Routes: {
    screen: DirectionsContainer,
    navigationOptions: {
      title: 'Plan your Routes',
    },
  },
  SaveForm: {
    screen: SaveRouteFormContainer,
    navigationOptions: {
      title: 'Name your Route',
    },
  },
});

export default TabNavigator({
  SavedRoutes: {
    screen: SavedRoutesContainer,
    navigationOptions: {
      tabBarLabel: 'All Routes',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="marker" />),
    },
  },
  PlanRoute: {
    screen: Stack,
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
