import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Content,
} from 'native-base';

import DirectionsContainer from '../containers/DirectionsContainer';

export default class RoutePlanningView extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired, // eslint-disable-line
  };

  render() {
    return (
      <Container>
        <Content>
          <DirectionsContainer navigation={ this.props.navigation } />
        </Content>
      </Container>
    );
  }
}
