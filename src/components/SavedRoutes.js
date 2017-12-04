import React from 'react';
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
  Button,
  Header,
  Body,
} from 'native-base';

import RouteDetails from './RouteDetails';
import sharedStyles from './styles/sharedStyles';
import { metersToMiles } from '../helpers/conversions';

const STEPS_PER_METER = 0.713;

export default class SavedRoutes extends React.Component {
  static propTypes = {
    savedRoutes: PropTypes.instanceOf(List).isRequired,
    clearAllSavedRoutes: PropTypes.func.isRequired,
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
    const totalDistance = selectedRoutes.reduce((distance, route) => distance + route.getIn(['route', 'distance']), 0);
    return totalDistance;
  };

  render() {
    const { savedRoutes } = this.props;
    const numberOfWalks = this.state.selectedRouteIds.size;
    const totalDistance = this.getTotalDistance();
    const placeholder = <ListItem style={ sharedStyles.listStackCorrection }><Text>You have no saved routes</Text></ListItem>;
    return (
      <Container>
        <Header>
          <Body><Text style={ sharedStyles.header }>Saved Walking Routes</Text></Body>
        </Header>
        <Content>
          <NbList>
            <ListItem itemDivider>
              <Text style={ sharedStyles.listDivider }>Select routes to See how many steps you‘ll take</Text>
            </ListItem>
            { !savedRoutes.size ? placeholder : (
              savedRoutes.map((route, index) => (
                <RouteDetails
                  key={ route.get('_wId') }
                  route={ route }
                  isSelected={ this.state.selectedRouteIds.includes(route.get('_wId')) }
                  toggleSelection={ this.toggleSelection }
                  deleteRoute={ this.props.deleteRoute }
                />
              ))
            ) }
            <Collapsible collapsed={ !numberOfWalks }>
              <ListItem itemDivider>
                <Text style={ sharedStyles.listDivider }>{ `Total Steps for ${numberOfWalks} Walk${numberOfWalks > 1 ? 's' : ''}` }</Text>
              </ListItem>
              <ListItem style={ sharedStyles.listStackCorrection }>
                <Text>
                  { `${Math.round(STEPS_PER_METER * totalDistance)} Steps for ${metersToMiles(totalDistance).toFixed(2)} miles` }
                </Text>
              </ListItem>
            </Collapsible>
            <ListItem style={ sharedStyles.listStackCorrection }>
              <Button transparent onPress={ this.props.clearAllSavedRoutes } disabled={ !this.props.savedRoutes.size }>
                <Text>Clear all Saved Routes</Text>
              </Button>
            </ListItem>
          </NbList>
        </Content>
      </Container>
    );
  }
}

