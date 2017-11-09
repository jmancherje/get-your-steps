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
import LocationSearch from './LocationSearch';
import Directions from './Directions';

const LocationSearchView = () => (
  <Container>
    <Header>
      <Body>
        <Title>Steps</Title>
      </Body>
    </Header>
    <Content>
      <Directions />
    </Content>
  </Container>
);

const Tabs = TabNavigator({
  Steps: {
    screen: Root,
    navigationOptions: {
      tabBarLabel: 'Steps',
    },
  },
  Location: {
    screen: LocationSearchView,
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
