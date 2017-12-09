import React from 'react';

import { StyleSheet } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Foundation } from '@expo/vector-icons';

import ProfileContainer from '../containers/ProfileContainer';
import DirectionsContainer from '../containers/DirectionsContainer';
import SavedRoutesContainer from '../containers/SavedRoutesContainer';
import SaveRouteFormContainer from '../containers/SaveRouteFormContainer';
import UpdateStepGoalFormContainer from '../containers/UpdateStepGoalFormContainer';

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
  },
});

const DirectionsStack = StackNavigator({
  Routes: {
    screen: DirectionsContainer,
    navigationOptions: {
      title: 'Create A Route',
    },
  },
  SaveForm: {
    screen: SaveRouteFormContainer,
    navigationOptions: {
      title: 'Name your Route',
    },
  },
});

const ProfileStack = StackNavigator({
  Profile: {
    screen: ProfileContainer,
    navigationOptions: {
      title: 'Profile',
    },
  },
  UpdateStepGoal: {
    screen: UpdateStepGoalFormContainer,
    navigationOptions: {
      title: 'Update your Daily Step Goal',
    },
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
    screen: DirectionsStack,
    navigationOptions: {
      tabBarLabel: 'New Route',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="map" />),
    },
  },
  Profile: {
    screen: ProfileStack,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: () => (<Foundation style={ styles.icon } name="home" />),
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
