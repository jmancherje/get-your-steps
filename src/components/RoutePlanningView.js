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
    numberOfDestinations: PropTypes.number.isRequired,
  };

  render() {
    const { numberOfDestinations } = this.props;
    return (
      <Container>
        <Header>
          <Left>
            <Button
              small
              danger
              disabled={ numberOfDestinations < 1 }
            >
              <Text>Reset</Text>
            </Button>
          </Left>
          <Body>
            <Title>Create Route</Title>
          </Body>
          <Right>
            <Button
              small
              disabled={ numberOfDestinations < 2 }
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
