import React from 'react';
import { View, StyleSheet } from 'react-native';
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

export default class SavedRoutes extends React.Component {
  static propTypes = {
    savedRoutes: PropTypes.instanceOf(List).isRequired,
    deleteRoute: PropTypes.func.isRequired,
    stepGoal: PropTypes.number.isRequired,
    stepsPerMeter: PropTypes.number.isRequired,
  };

  state = {
    selectedRouteIds: List(),
  };

  addSelection = (id) => {
    this.setState({ selectedRouteIds: this.state.selectedRouteIds.push(id) });
  };

  removeSelection = (id) => {
    this.setState({ selectedRouteIds: this.state.selectedRouteIds.filterNot(selectedId => selectedId === id) });
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
    const { savedRoutes, stepGoal, stepsPerMeter } = this.props;
    const numberOfWalks = this.state.selectedRouteIds.size;
    const totalDistance = this.getTotalDistance();
    const calculatedSteps = Math.round(totalDistance / stepsPerMeter);
    const noSavedRoutesPlaceholder = <ListItem style={ sharedStyles.listStackCorrection }><Text>You have no saved routes</Text></ListItem>;
    const noRoutesSelectedPlaceholderText = "Select routes to see how much you'll walk";

    const percentageOfGoal = Math.round((calculatedSteps / stepGoal) * 100);
    return (
      <Container>
        <Header>
          <Body><Text style={ sharedStyles.header }>Saved Walking Routes</Text></Body>
        </Header>
        { !savedRoutes.size ? null : (
          <ListItem itemDivider>
            <Text style={ sharedStyles.listDivider }>{ !numberOfWalks ? noRoutesSelectedPlaceholderText : `Total Steps for ${numberOfWalks} Walk${numberOfWalks > 1 ? 's' : ''}` }</Text>
          </ListItem>
        ) }
        <Collapsible collapsed={ !numberOfWalks }>
          <ListItem style={ sharedStyles.listStackCorrection }>
            <Text>
              { `${calculatedSteps} Steps for ${metersToMiles(totalDistance).toFixed(2)} miles` }
            </Text>
          </ListItem>
          <ListItem style={ [sharedStyles.listStackCorrection, styles.headerListItems] }>
            <Text>
              { calculatedSteps >= stepGoal ? `This meets your daily step goal of ${stepGoal}` : `This is ${percentageOfGoal}% of your ${stepGoal} step goal`}
            </Text>
          </ListItem>
        </Collapsible>
        <Content>
          <NbList>
            { !savedRoutes.size ? noSavedRoutesPlaceholder : (
              savedRoutes.map((route, index) => (
                <View key={ route.get('_wId') }>
                  <RouteDetails
                    savedRoute={ route }
                    deleteRoute={ this.props.deleteRoute }
                    addSelection={ this.addSelection }
                    removeSelection={ this.removeSelection }
                    selectedCount={ this.state.selectedRouteIds.count(id => id === route.get('_wId')) }
                    stepsPerMeter={ stepsPerMeter }
                  />
                </View>
              ))
            ) }
          </NbList>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerListItems: {
    borderBottomWidth: 3,
    borderColor: '#e2e2e2',
  },
});
