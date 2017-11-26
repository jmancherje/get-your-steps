import React from 'react';
import PropTypes from 'prop-types';
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
} from 'native-base';

import DirectionsContainer from '../containers/DirectionsContainer';

export default class RoutePlanningView extends React.Component {
  static propTypes = {
    // showMap: PropTypes.bool.isRequired,
    // updateShowMap: PropTypes.func.isRequired,
    // hasDestinations: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              small
            >
              <Text>Reset</Text>
            </Button>
          </Left>
          <Body>
            <Title>Create Route</Title>
          </Body>
          <Right>
            <Button
              transparent
              small
            >
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
