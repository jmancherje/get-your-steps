import React from 'react';
import {
  Container,
  Header,
  Body,
  Title,
  Content,
} from 'native-base';

import StepsContainer from '../containers/StepsContainer';
import LocationContainer from '../containers/LocationContainer';

export default class Root extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Steps</Title>
          </Body>
        </Header>
        <Content>
          <LocationContainer />
          <StepsContainer />
        </Content>
      </Container>
    );
  }
}
