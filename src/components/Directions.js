import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Text,
  List as NbList,
  Left,
  Body,
  Right,
  Button,
  ListItem,
  Footer,
  FooterTab,
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';
import Collapsible from 'react-native-collapsible';

import LocationSearch from './LocationSearch';
import WaypointListItem from './WaypointListItem';
import MapComponent from './MapComponent';
import { metersToMiles } from '../helpers/conversions';
import sharedStyles from './styles/sharedStyles';
import getDetailsArrayFromRoute from '../helpers/getDetailsFromRoute';

export default class Directions extends Component {
  static navigationOptions = {
    title: 'Create a New Route',
  };
  static propTypes = {
    updateActiveIndex: PropTypes.func.isRequired,
    clearDestinationIndex: PropTypes.func.isRequired,
    activeRouteIndex: PropTypes.number.isRequired,
    searchedRouteOptions: PropTypes.instanceOf(List).isRequired,
    updateDestinations: PropTypes.func.isRequired,
    addCurrentLocationToDestinations: PropTypes.func.isRequired,
    destinations: PropTypes.instanceOf(List).isRequired,
    currentLocation: PropTypes.instanceOf(Map).isRequired,
    numberOfDestinations: PropTypes.number.isRequired,
    resetDirections: PropTypes.func.isRequired,
    saveRoute: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired, // eslint-disable-line
    stepsPerMeter: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowingDistance: true,
      mapSnapshot: null,
      name: null,
      showSaveForm: false,
    };
  }

  showSaveForm = () => {
    this.setState({ showSaveForm: true });
    if (this.saveRef && this.saveRef._root) {
      this.saveRef._root.focus();
    }
  };

  hideSaveForm = () => {
    this.setState({ showSaveForm: false });
  };

  saveRef = null;
  setSaveRef = (ref) => {
    if (ref) {
      this.saveRef = ref;
    }
  };

  inputRef = null;
  setInputRef = (ref) => {
    if (ref) {
      this.inputRef = ref;
    }
  };

  mapRef = null;
  setInnerMapRef = (ref) => {
    if (ref) {
      this.mapRef = ref;
    }
  };

  handleNameChange = (name) => {
    this.setState({ name });
  };

  focusInput = () => {
    this.inputRef && this.inputRef.triggerFocus();
  };

  navigateToSave = () => {
    this.props.navigation.navigate('SaveForm');
  };

  toggleDistance = () => {
    this.setState({ isShowingDistance: !this.state.isShowingDistance });
  };

  handleSave = () => {
    const { name } = this.state;
    if (this.saveRef && this.saveRef._root) {
      this.saveRef._root.clear();
    }
    this.props.saveRoute({ name });
    this.props.resetDirections();
    this.setState({ showSaveForm: false, name: null });
    this.props.navigation.navigate('SavedRoutes');
  };

  render() {
    const {
      activeRouteIndex,
      searchedRouteOptions,
      destinations,
      clearDestinationIndex,
      resetDirections,
      numberOfDestinations,
      stepsPerMeter,
    } = this.props;
    if (!searchedRouteOptions) return null;
    const activeRoute = searchedRouteOptions.get(activeRouteIndex, Map());
    const { distance: totalDistance } = getDetailsArrayFromRoute(activeRoute);
    return (
      <Container>
        <Content
          keyboardShouldPersistTaps="always"
        >
          <NbList>
            <Collapsible collapsed={ !this.state.showSaveForm }>
              <ListItem itemDivider>
                <Left>
                  <Text>Save Route</Text>
                </Left>
                <Right>
                  <Button small danger onPress={ this.hideSaveForm }>
                    <Text>Cancel</Text>
                  </Button>
                </Right>
              </ListItem>
              <Form>
                <Item>
                  <Label>Route Name</Label>
                  <Input
                    ref={ this.setSaveRef }
                    onChangeText={ this.handleNameChange }
                    onSubmitEditing={ this.handleSave }
                    returnKeyType="done"
                  />
                </Item>
              </Form>
              <Button
                full
                info
                disabled={ !this.state.name }
                onPress={ this.handleSave }
              >
                <Text>Confirm</Text>
              </Button>
            </Collapsible>
            <ListItem itemDivider>
              <Left>
                <Text>Walking Route</Text>
              </Left>
              { !numberOfDestinations ? (
                <Body>
                  <Text>Add a starting point</Text>
                </Body>
              ) : (
                <Right>
                  <Button small transparent danger onPress={ resetDirections }>
                    <Text style={ styles.resetBtn }>Reset</Text>
                  </Button>
                </Right>
              ) }
            </ListItem>
            <View>
              { destinations.size ? (
                destinations.map((destination, index) => (
                  <WaypointListItem
                    key={ destination.get('_dId') || `key_${index}` }
                    clearDestinationIndex={ clearDestinationIndex }
                    destination={ destination }
                    index={ index }
                  />
                ))
              ) : null }
              <LocationSearch
                setInputRef={ this.setInputRef }
                numberOfDestinations={ numberOfDestinations }
                handleSelectLocation={ this.props.updateDestinations }
                leftButtonText={ destinations.size ? 'Add Destination' : 'Starting Point' }
                hasCurrentLocation // Currently hard coding to true so we can use the button below
                addCurrentLocationToDestinations={ this.props.addCurrentLocationToDestinations }
              />
            </View>
            <ListItem
              itemDivider
              style={ sharedStyles.listStackCorrection }
              onPress={ this.toggleDistance }
            >
              <Left>
                <Text>Distance and Estimated Steps</Text>
              </Left>
              <Right>
                <Text style={ styles.expandButton }>{ this.state.isShowingDistance ? 'v' : '>' }</Text>
              </Right>
            </ListItem>
            <Collapsible collapsed={ !this.state.isShowingDistance }>
              <ListItem style={ sharedStyles.listStackCorrection }>
                { totalDistance ? (
                  <Text>{ `${Math.round(totalDistance / stepsPerMeter)} steps (for ${metersToMiles(totalDistance).toFixed(2)} miles)` }</Text>
                ) : (
                  <Text style={ styles.smallText }>Add destinations to get your route and estimated steps</Text>
                ) }
              </ListItem>
            </Collapsible>
            <ListItem
              itemDivider
              style={ sharedStyles.listStackCorrection }
            >
              <Body><Text>Map</Text></Body>
            </ListItem>
            <Collapsible collapsed={ !this.props.destinations.size }>
              <MapComponent
                setInnerMapRef={ this.setInnerMapRef }
                destinations={ this.props.destinations }
                updateActiveIndex={ this.props.updateActiveIndex }
                searchedRouteOptions={ this.props.searchedRouteOptions }
                activeRouteIndex={ this.props.activeRouteIndex }
                currentLocation={ this.props.currentLocation }
              />
            </Collapsible>
          </NbList>
        </Content>
        <Footer style={ styles.footer }>
          <FooterTab>
            <Button
              full
              info={ numberOfDestinations < 2 }
              success={ numberOfDestinations >= 2 }
              onPress={ numberOfDestinations >= 2 ? this.showSaveForm : this.focusInput }
            >
              <Text style={ styles.saveButton }>
                { numberOfDestinations < 2 ? 'Get Started' : 'Save Route' }
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  smallText: {
    fontSize: 13,
    color: '#8c8c8c',
  },
  expandButton: {
    fontSize: 16,
  },
  saveButton: {
    color: 'white',
    fontSize: 17,
  },
  resetBtn: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  footer: {
    maxHeight: 55,
  },
});
