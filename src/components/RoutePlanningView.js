import React from 'react';
// import PropTypes from 'prop-types';
import {
  Container,
  Header,
  Body,
  Title,
  Content,
  Right,
  Button,
  Text,
  Left,
  Icon,
} from 'native-base';

import DirectionsContainer from '../containers/DirectionsContainer';

export default class RoutePlanningView extends React.Component {
  static navigatorOptions = {
    tabBarLabel: 'Routes',
    tabBarIcon: () => (<Icon name="home" />),
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              small
              danger
            >
              <Text>Reset</Text>
            </Button>
          </Left>
          <Body>
            <Title>Create Route</Title>
          </Body>
          <Right>
            <Button small>
              <Text>Save</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <DirectionsContainer />
        </Content>
      </Container>
    );
  }
}
