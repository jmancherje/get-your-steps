import React from 'react';
import {
  Container,
  Header,
  Body,
  Title,
  Content,
} from 'native-base';
import { TabNavigator } from 'react-navigation';

import Root from './Root';
import DirectionsContainer from '../containers/DirectionsContainer';

const LocationSearchView = () => (
  <Container>
    <Header>
      <Body>
        <Title>Create Walking Route</Title>
      </Body>
    </Header>
    <Content>
      <DirectionsContainer />
    </Content>
  </Container>
);

const Tabs = TabNavigator({
  Location: {
    screen: LocationSearchView,
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
