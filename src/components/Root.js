import React from 'react';
import {
  Container,
  Content,
} from 'native-base';

import ProfileContainer from '../containers/ProfileContainer';

export default class Root extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <ProfileContainer />
        </Content>
      </Container>
    );
  }
}
