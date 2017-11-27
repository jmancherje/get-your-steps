import { List } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import {
  List as NbList,
  ListItem,
  Text,
  Container,
  Content,
  Header,
  Body,
  Title,
} from 'native-base';

import { metersToMiles } from '../helpers/conversions';

const STEPS_PER_METER = 0.713;

export default class SavedRoutes extends React.Component {
  static propTypes = {
    savedRoutes: PropTypes.instanceOf(List).isRequired,
  };

  render() {
    const { savedRoutes } = this.props;
    const placeholder = <ListItem><Text>You have no saved routes</Text></ListItem>;
    return (
      <Container>
        <Header>
          <Body>
            <Title>Saved Routes</Title>
          </Body>
        </Header>
        <Content>
          <NbList>
            { !savedRoutes.size ? placeholder : (
              savedRoutes.map((route, index) => {
                const distance = route.getIn(['route', 'distance']);
                return (
                  // TODO: get a uuid to use for a key
                  // eslint-disable-next-line
                  <ListItem key={ `key_${index}` }>
                    <Text>
                      { route.get('name', 'Unnamed Route') }
                    </Text>
                    <Text>
                      { `${Math.round(distance / STEPS_PER_METER)} steps (for ${metersToMiles(distance).toFixed(2)} miles)` }
                    </Text>
                  </ListItem>
                );
              })
            ) }
          </NbList>
        </Content>
      </Container>
    );
  }
}
