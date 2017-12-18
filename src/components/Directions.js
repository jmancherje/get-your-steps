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

import WaypointListItem from './WaypointListItem';
import MapComponent from './MapComponent';
import AddDestination from './AddDestination';
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
      name: null,
      showSaveForm: false,
      addExtraDestinations: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.addExtraDestinations && nextProps.destinations.size !== this.props.destinations.size) {
      this.setState({
        addExtraDestinations: false,
      });
    }
  }

  addExtraDestinations = () => {
    this.setState({ addExtraDestinations: true });
  };

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
    if (destinations.size <= 1 || this.state.addExtraDestinations) {
      return (
        <AddDestination
          numberOfDestinations={ numberOfDestinations }
          handleSelectLocation={ this.props.updateDestinations }
        />
      );
    }
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
                primary
                disabled={ !this.state.name }
                onPress={ this.handleSave }
              >
                <Text>Confirm</Text>
              </Button>
            </Collapsible>
            <ListItem
              itemDivider
              style={ sharedStyles.listStackCorrection }
            >
              <Body>
                <Text>Distance and Estimated Steps</Text>
              </Body>
            </ListItem>
            <ListItem style={ sharedStyles.listStackCorrection }>
              <Text>{ `${Math.round(totalDistance / stepsPerMeter)} steps (for ${metersToMiles(totalDistance).toFixed(2)} miles)` }</Text>
            </ListItem>
            <ListItem
              itemDivider
              style={ sharedStyles.listStackCorrection }
            >
              <Text style={ styles.padMap }>Map</Text><Text style={ styles.smallFont }> (tap to choose best route)</Text>
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
            <ListItem itemDivider>
              <Left>
                <Text>Walking Route</Text>
              </Left>
              <Right>
                <Button small transparent danger onPress={ resetDirections }>
                  <Text style={ styles.resetBtn }>Reset</Text>
                </Button>
              </Right>
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
              <ListItem style={ [sharedStyles.listStackCorrection, { height: 35 }] }>
                <Body>
                  <Button transparent small onPress={ this.addExtraDestinations }>
                    <Text>Add another destination</Text>
                  </Button>
                </Body>
              </ListItem>
            </View>
          </NbList>
        </Content>
        <Footer style={ styles.footer }>
          <FooterTab>
            <Button
              full
              primary
              onPress={ this.showSaveForm }
            >
              <Text style={ styles.saveButton }>
                Save Route
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  smallFont: {
    fontSize: 13,
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
    alignItems: 'flex-end',
  },
  footer: {
    maxHeight: 55,
  },
  padMap: {
    paddingLeft: 10,
  },
});
