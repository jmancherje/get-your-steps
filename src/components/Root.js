import React from 'react';
import {
  Container,
  Content,
} from 'native-base';

import StepsContainer from '../containers/StepsContainer';
import LocationContainer from '../containers/LocationContainer';

export default class Root extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <LocationContainer />
          <StepsContainer />
        </Content>
      </Container>
    );
  }
}
