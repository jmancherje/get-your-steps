import React from 'react';
import { View } from 'react-native';
import { List } from 'immutable';
import { identity } from 'lodash';
import PropTypes from 'prop-types';
import Collapsible from 'react-native-collapsible';
import {
  List as NbList,
  ListItem,
  Text,
  Container,
  Content,
  Header,
  Body,
} from 'native-base';

import RouteDetails from './RouteDetails';
import sharedStyles from './styles/sharedStyles';
import { metersToMiles } from '../helpers/conversions';
import getDetailsArrayFromRoute from '../helpers/getDetailsFromRoute';

const STEPS_PER_METER = 0.713;

export default class SavedRoutes extends React.Component {
  static propTypes = {
    savedRoutes: PropTypes.instanceOf(List).isRequired,
    deleteRoute: PropTypes.func.isRequired,
  };

  state = {
    selectedRouteIds: List(),
  };

  toggleSelection = (id) => {
    const { selectedRouteIds } = this.state;
    if (selectedRouteIds.includes(id)) {
      this.setState({ selectedRouteIds: selectedRouteIds.filterNot(routeId => routeId === id) });
      return;
    }
    this.setState({ selectedRouteIds: selectedRouteIds.push(id) });
  };

  getTotalDistance = () => {
    const { selectedRouteIds } = this.state;
    const { savedRoutes } = this.props;

    const selectedRoutes = selectedRouteIds.map(id => savedRoutes.find(route => route.get('_wId') === id)).filter(identity);
    const totalDistance = selectedRoutes.reduce((distanceAccumulator, routeDetails) => {
      const { distance } = getDetailsArrayFromRoute(routeDetails.get('route'));
      return distanceAccumulator + distance;
    }, 0);
    return totalDistance;
  };

  render() {
    const { savedRoutes } = this.props;
    const numberOfWalks = this.state.selectedRouteIds.size;
    const totalDistance = this.getTotalDistance();
    const noSavedRoutesPlaceholder = <ListItem style={ sharedStyles.listStackCorrection }><Text>You have no saved routes</Text></ListItem>;
    const noRoutesSelectedPlaceholderText = "Select routes to see how much you'll walk";
    return (
      <Container>
        <Header>
          <Body><Text style={ sharedStyles.header }>Saved Walking Routes</Text></Body>
        </Header>
        <Content>
          <NbList>
            { !savedRoutes.size ? noSavedRoutesPlaceholder : (
              savedRoutes.map((route, index) => (
                <View
                  key={ route.get('_wId') }
                >
                  <RouteDetails
                    savedRoute={ route }
                    isSelected={ this.state.selectedRouteIds.includes(route.get('_wId')) }
                    toggleSelection={ this.toggleSelection }
                    deleteRoute={ this.props.deleteRoute }
                  />
                </View>
              ))
            ) }
            { !savedRoutes.size ? null : (
              <ListItem itemDivider>
                <Text style={ sharedStyles.listDivider }>{ !numberOfWalks ? noRoutesSelectedPlaceholderText : `Total Steps for ${numberOfWalks} Walk${numberOfWalks > 1 ? 's' : ''}` }</Text>
              </ListItem>
            ) }
            <Collapsible collapsed={ !numberOfWalks }>
              <ListItem style={ sharedStyles.listStackCorrection }>
                <Text>
                  { `${Math.round(STEPS_PER_METER * totalDistance)} Steps for ${metersToMiles(totalDistance).toFixed(2)} miles` }
                </Text>
              </ListItem>
            </Collapsible>
          </NbList>
        </Content>
      </Container>
    );
  }
}

