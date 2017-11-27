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
    resetDirections: PropTypes.func.isRequired,
    saveRoute: PropTypes.func.isRequired,
  };

  render() {
    const { numberOfDestinations, resetDirections } = this.props;
    return (
      <Container>
        <Header>
          <Left>
            <Button
              small
              danger
              disabled={ numberOfDestinations < 1 }
              onPress={ resetDirections }
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
              onPress={ this.props.saveRoute }
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
