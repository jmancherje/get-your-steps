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
} from 'native-base';

import DirectionsContainer from '../containers/DirectionsContainer';

export default class RoutePlanningView extends React.Component {
  static propTypes = {
    showMap: PropTypes.bool.isRequired,
    updateShowMap: PropTypes.func.isRequired,
    hasDestinations: PropTypes.bool.isRequired,
  };

  render() {
    const {
      showMap,
      updateShowMap,
      hasDestinations,
    } = this.props;

    return (
      <Container>
        <Header>
          <Body>
            <Title>Create Route</Title>
          </Body>
          <Right>
            { hasDestinations ? (
              <Button
                transparent
                small
                onPress={ updateShowMap }
              >
                <Text>{ showMap ? 'Hide Map' : 'Show Map' }</Text>
              </Button>
            ) : null }
          </Right>
        </Header>
        <Content>
          <DirectionsContainer />
        </Content>
      </Container>
    );
  }
}
