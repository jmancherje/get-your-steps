import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { MapView } from 'expo';
import {
  Text,
  List as NbList,
  Left,
  Right,
  Button,
  ListItem,
} from 'native-base';

import LocationSearch from './LocationSearch';
import WaypointListItem from './WaypointListItem';
import { metersToMiles } from '../helpers/conversions';
import Polyline from './Polyline';

// This type is just for reference
// eslint-disable-next-line no-unused-vars
type LocationObjectType = {
  coords: {
    latitude: number,
    longitude: number,
    altitude: number,
    accuracy: number,
    altitudeAccuracy: number,
    heading: number,
    speed: number,
  },
  timestamp: number,
};

// Based on average 5'8" person
// TODO: customize this for all users
const STEPS_PER_METER = 0.713;

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const mapWidth = deviceWidth;
const mapHeight = Math.round(deviceHeight / 2);
const aspectRatio = mapWidth / mapHeight;
const LATITUDE_DELTA = 0.0012299763249572493;
const LONGITUDE_DELTA = LATITUDE_DELTA * aspectRatio;

const mapRegion = {
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
export default class Directions extends Component {
  static propTypes = {
    currentStepCount: PropTypes.number.isRequired,
    resetCurrentStepCount: PropTypes.func.isRequired,
    updateActiveIndex: PropTypes.func.isRequired,
    clearDestinationIndex: PropTypes.func.isRequired,
    resetActiveSearchedRoutes: PropTypes.func.isRequired,
    activeRouteIndex: PropTypes.number.isRequired,
    searchedRouteOptions: PropTypes.instanceOf(List).isRequired,
    updateDestinations: PropTypes.func.isRequired,
    addCurrentLocationToDestinations: PropTypes.func.isRequired,
    destinations: PropTypes.instanceOf(List).isRequired,
    updateShowMap: PropTypes.func.isRequired,
    showMap: PropTypes.bool.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchedRouteOptions.size && nextProps.searchedRouteOptions !== this.props.searchedRouteOptions) {
      this.fitMap(nextProps.searchedRouteOptions.getIn([0, 'steps']));
    }

    if (this.props.destinations.size === 0 && nextProps.destinations.size !== 0) {
      this.props.updateShowMap(true);
    }
  }

  hideMap = () => {
    this.props.updateShowMap(false);
  };

  setMapRef = (ref) => {
    this.map = ref;
  };

  fitMap = (steps) => {
    if (List.isList(steps)) {
      steps = steps.toJS();
    }
    // NOTE this is expecting an array of objects, not a list of maps
    if (!this.map || steps.length < 2) return;
    this.map.fitToCoordinates(steps, {
      edgePadding: { top: 15, right: 15, bottom: 15, left: 15 },
      animated: true,
    });
  };

  resetMap = () => {
    this.props.resetActiveSearchedRoutes();
  };

  getPolylines = () => {
    const {
      searchedRouteOptions,
      activeRouteIndex,
      updateActiveIndex,
    } = this.props;
    if (!searchedRouteOptions) return null;

    return searchedRouteOptions.map((route, idx) => (
      <Polyline
        key={ route.get('distance') }
        steps={ route.get('steps', List()).toJS() }
        index={ idx }
        activeIndex={ activeRouteIndex }
        onPress={ updateActiveIndex }
      />
    ));
  };

  renderMap = () => {
    const {
      destinations,
      searchedRouteOptions,
      activeRouteIndex,
      showMap,
    } = this.props;
    if (destinations.size === 0) return null;
    const lastDestination = destinations.last();
    const longitude = lastDestination.getIn(['coordinates', 'longitude']);
    const latitude = lastDestination.getIn(['coordinates', 'latitude']);
    const region = {
      // TODO: calculate the deltas using the viewport data with ...mapRegion as a fallback
      ...mapRegion,
      longitude,
      latitude,
    };
    const activeRoute = searchedRouteOptions.get(activeRouteIndex, Map());
    const activeSteps = activeRoute.get('steps', List());
    if (showMap) {
      return (
        <View
          style={ styles.mapDimensions }
        >
          <Button
            transparent
            small
            style={ { position: 'absolute', left: 0, top: 0, zIndex: 100 } }
            onPress={ this.hideMap }
          >
            <Text>Hide Map</Text>
          </Button>
          <MapView
            ref={ this.setMapRef }
            style={ { width: '100%', height: '100%' } }
            initialRegion={ region }
          >
            <MapView.Marker
              coordinate={ { latitude, longitude } }
              title="🖕😎🖕"
            >
              <View
                style={ styles.mapMarker }
              />
            </MapView.Marker>
            { activeSteps.size ? this.getPolylines() : null }
          </MapView>
        </View>
      );
    }
    return null;
  };

  render() {
    const {
      activeRouteIndex,
      searchedRouteOptions,
      destinations,
      clearDestinationIndex,
    } = this.props;
    if (!searchedRouteOptions) return null;
    const hasCurrentLocation = destinations.some(dest => dest.get('name') === 'Current Location');
    const activeRoute = searchedRouteOptions.get(activeRouteIndex, Map());
    return (
      <View style={ styles.device }>
        <NbList>
          <ListItem itemDivider>
            <Text>Walking Route</Text>
          </ListItem>
          <View>
            { destinations.size ? (
              destinations.map((destination, index) => (
                <WaypointListItem
                  key={ destination.get('dataPlaceId') || `key_${index}` }
                  clearDestinationIndex={ clearDestinationIndex }
                  destination={ destination }
                  index={ index }
                />
              ))
            ) : null }
            <LocationSearch
              handleSelectLocation={ this.props.updateDestinations }
              leftButtonText={ destinations.size ? 'Add Destination' : 'Starting Point' }
              hasCurrentLocation={ hasCurrentLocation }
              addCurrentLocationToDestinations={ this.props.addCurrentLocationToDestinations }
            />
          </View>
          <ListItem itemDivider>
            <Text>Map</Text>
          </ListItem>
          { this.renderMap() }
          <ListItem itemDivider>
            <Text>Distance and Estimated Steps</Text>
          </ListItem>
          <ListItem>
            <Text>{ `${Math.round(activeRoute.get('distance') / STEPS_PER_METER)} steps (for ${metersToMiles(activeRoute.get('distance')).toFixed(2)} miles)` }</Text>
          </ListItem>
          <ListItem itemDivider>
            <Text>Current Step Count</Text>
          </ListItem>
          <ListItem>
            <Left>
              <Text style={ styles.stepText }>Total Steps: { this.props.currentStepCount }</Text>
            </Left>
            <Right>
              <Button
                small
                transparent
                onPress={ this.props.resetCurrentStepCount }
              >
                <Text>Reset</Text>
              </Button>
            </Right>
          </ListItem>
        </NbList>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  device: {
    width: deviceWidth,
  },
  mapDimensions: {
    width: mapWidth,
    height: mapHeight,
  },
  mapMarker: {
    backgroundColor: 'blue',
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  listDividerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listDivider: {
    height: 30,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  itemHeader: {
    height: 30,
  },
  stepText: {
    marginLeft: 0,
  },
});
