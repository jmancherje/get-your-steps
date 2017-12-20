import React from 'react';

import { StyleSheet } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Foundation } from '@expo/vector-icons';

import ProfileContainer from '../containers/ProfileContainer';
import DirectionsContainer from '../containers/DirectionsContainer';
import SavedRoutesContainer from '../containers/SavedRoutesContainer';

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
  },
});

export default TabNavigator({
  SavedRoutes: {
    screen: SavedRoutesContainer,
    navigationOptions: {
      tabBarLabel: 'All Routes',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="list-thumbnails" />),
    },
  },
  PlanRoute: {
    screen: DirectionsContainer,
    navigationOptions: {
      tabBarLabel: 'New Route',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="map" />),
    },
  },
  Profile: {
    screen: ProfileContainer,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="home" />),
    },
  },
}, {
  animationEnabled: true,
  initialRouteName: 'PlanRoute',
  // swipeEnabled: true, // TODO: figure out how to enable this without breaking swipe to delete route :(
  tabBarOptions: {
    labelStyle: {
      fontSize: 14,
      fontFamily: 'Roboto_medium',
    },

  },
});
