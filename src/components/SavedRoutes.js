import { List } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import {
  List as NbList,
  ListItem,
  Text,
  Container,
  Content,
  Button,
} from 'native-base';

import { metersToMiles } from '../helpers/conversions';
import sharedStyles from './styles/sharedStyles';

const STEPS_PER_METER = 0.713;

export default class SavedRoutes extends React.Component {
  static propTypes = {
    savedRoutes: PropTypes.instanceOf(List).isRequired,
    clearAllSavedRoutes: PropTypes.func.isRequired,
  };

  render() {
    const { savedRoutes } = this.props;
    const placeholder = <ListItem style={ sharedStyles.listStackCorrection }><Text>You have no saved routes</Text></ListItem>;
    return (
      <Container>
        <Content>
          <NbList>
            { !savedRoutes.size ? placeholder : (
              savedRoutes.map((route, index) => {
                const distance = route.getIn(['route', 'distance']);
                return (
                  <ListItem key={ `key_${route.get('_wId')}` } style={ sharedStyles.listStackCorrection }>
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
            { savedRoutes.size ? (
              <ListItem style={ sharedStyles.listStackCorrection }>
                <Button transparent onPress={ this.props.clearAllSavedRoutes }>
                  <Text>Clear all Saved Routes</Text>
                </Button>
              </ListItem>
            ) : null }
          </NbList>
        </Content>
      </Container>
    );
  }
}
