import { List, Map } from 'immutable';
import React from 'react';
import { View } from 'react-native';
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
  Grid,
  Col,
  Row,
  CheckBox,
} from 'native-base';

import sharedStyles from './styles/sharedStyles';

const STEPS_PER_METER = 0.713;

class RouteDetails extends React.Component {
  static propTypes = {
    route: PropTypes.instanceOf(Map).isRequired,
    isSelected: PropTypes.bool.isRequired,
    toggleSelection: PropTypes.func.isRequired,
  };

  state = {
    active: false,
  };

  handlePress = () => {
    this.setState({ active: !this.state.active });
  };

  handleCheckBoxPress = () => {
    this.props.toggleSelection(this.props.route.get('_wId'));
  };

  render() {
    const { route, isSelected } = this.props;
    return (
      <View>
        <ListItem
          style={ sharedStyles.listStackCorrection }
          onPress={ this.handlePress }
        >
          <Grid>
            <Col size={ 1 } style={ sharedStyles.justifyCenter }>
              <CheckBox
                checked={ isSelected }
                onPress={ this.handleCheckBoxPress }
              />
            </Col>
            <Col size={ 6 }>
              <Row><Text>{ route.get('name') }</Text></Row>
              <Row><Text>{ `${Math.round(STEPS_PER_METER * (route.getIn(['route', 'distance'])))} Steps` }</Text></Row>
            </Col>
          </Grid>
        </ListItem>
        <Collapsible collapsed={ !this.state.active }>
          <ListItem style={ sharedStyles.listStackCorrection }>
            <Text>{ route.get('details') }</Text>
          </ListItem>
        </Collapsible>
      </View>
    );
  }
}


export default class SavedRoutes extends React.Component {
  static propTypes = {
    savedRoutes: PropTypes.instanceOf(List).isRequired,
    clearAllSavedRoutes: PropTypes.func.isRequired,
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

  getTotalSteps = () => {
    const { selectedRouteIds } = this.state;
    const { savedRoutes } = this.props;

    const selectedRoutes = selectedRouteIds.map(id => savedRoutes.find(route => route.get('_wId') === id)).filter(identity);
    const totalDistance = selectedRoutes.reduce((distance, route) => distance + route.getIn(['route', 'distance']), 0);
    return Math.round(totalDistance * STEPS_PER_METER);
  };

  render() {
    const { savedRoutes } = this.props;
    const placeholder = <ListItem style={ sharedStyles.listStackCorrection }><Text>You have no saved routes</Text></ListItem>;
    return (
      <Container>
        <Content>
          <NbList>
            { !savedRoutes.size ? placeholder : (
              savedRoutes.map((route, index) => (
                <RouteDetails
                  key={ route.get('_wId') }
                  route={ route }
                  isSelected={ this.state.selectedRouteIds.includes(route.get('_wId')) }
                  toggleSelection={ this.toggleSelection }
                />
              ))
            ) }
            <Collapsible collapsed={ !this.state.selectedRouteIds.size }>
              <ListItem style={ sharedStyles.listStackCorrection }>
                <Text>
                  { `${this.getTotalSteps()} Steps` }
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
