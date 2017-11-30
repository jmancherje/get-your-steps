import React from 'react';
import {
  Container,
  Content,
} from 'native-base';

import DirectionsContainer from '../containers/DirectionsContainer';

export default class RoutePlanningView extends React.Component {

  render() {
    return (
      <Container>
        <Content>
          <DirectionsContainer />
        </Content>
      </Container>
    );
  }
}
