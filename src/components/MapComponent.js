import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import { noop } from 'lodash';
import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { MapView } from 'expo';

import Polyline from './Polyline';
import getDetailsArrayFromRoute from '../helpers/getDetailsFromRoute';

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

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const mapWidth = deviceWidth;
const mapHeight = Math.round(deviceHeight / 4);
const aspectRatio = mapWidth / mapHeight;
const LATITUDE_DELTA = 0.0012299763249572493;
const LONGITUDE_DELTA = LATITUDE_DELTA * aspectRatio;

const mapRegion = {
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
export default class MapComponent extends Component {
  static propTypes = {
    updateActiveIndex: PropTypes.func,
    route: PropTypes.instanceOf(Map),
    activeRouteIndex: PropTypes.number,
    searchedRouteOptions: PropTypes.instanceOf(List),
    destinations: PropTypes.instanceOf(List).isRequired,
    currentLocation: PropTypes.instanceOf(Map),
  };
  static defaultProps = {
    route: Map(),
    activeRouteIndex: 0,
    searchedRouteOptions: List(),
    updateActiveIndex: noop,
    currentLocation: Map(),
  };

  componentDidUpdate(prevProps) {
    if (
      (prevProps.searchedRouteOptions !== this.props.searchedRouteOptions) ||
      (prevProps.activeRouteIndex !== this.props.activeRouteIndex)
    ) {
      this.fitMap();
    }
  }

  map = null;

  setMapRef = (ref) => {
    this.map = ref;
  };

  fitMap = () => {
    const { route, searchedRouteOptions, activeRouteIndex } = this.props;
    const effectiveRoute = route.isEmpty() ? searchedRouteOptions.get(activeRouteIndex, Map()) : route;
    if (effectiveRoute.isEmpty()) return;
    const { steps } = getDetailsArrayFromRoute(effectiveRoute);
    this.map.fitToCoordinates(steps, {
      edgePadding: { top: 15, right: 15, bottom: 15, left: 15 },
      animated: true,
    });
  };

  getRoutesFromProps = () => {
    const {
      searchedRouteOptions,
      route,
    } = this.props;
    let routes = searchedRouteOptions;
    if (!routes.size) {
      routes = List([route]);
    }
    if (!routes.size) return List();
    return routes;
  };

  getPolylines = () => {
    const {
      activeRouteIndex,
      updateActiveIndex,
    } = this.props;
    const routes = this.getRoutesFromProps();

    return routes.map((routeOption, idx) => {
      const { steps, distance } = getDetailsArrayFromRoute(routeOption);
      return (<Polyline
        key={ routeOption.getIn(['overview_polyline', 'points'], distance) }
        steps={ steps }
        index={ idx }
        activeIndex={ activeRouteIndex }
        onPress={ updateActiveIndex }
      />);
    });
  };

  getDestinationWaypoints = () => {
    const {
      destinations,
      currentLocation,
    } = this.props;
    const pins = [];
    if (Map.isMap(currentLocation) && !currentLocation.isEmpty()) {
      pins.push(
        <MapView.Marker
          key="current location marker"
          coordinate={ { latitude: currentLocation.get('latitude'), longitude: currentLocation.get('longitude') } }
          title="Current Location"
        >
          <View
            style={ [styles.mapMarker, styles.waypointMarker] }
          />
        </MapView.Marker>
      );
    }
    destinations.forEach((destination, index) => {
      if (index === 0) {
        pins.push(
          <MapView.Marker
            key={ destination.get('dataPlaceId', destination.get('name')) }
            coordinate={ destination.get('coordinates', Map()).toJS() }
          >
            <View
              style={ [styles.mapMarker, styles.startMarker] }
            />
          </MapView.Marker>
        );
      } else if (index === destinations.size - 1) {
        pins.push(
          <MapView.Marker
            key={ destination.get('dataPlaceId', destination.get('name')) }
            coordinate={ destination.get('coordinates', Map()).toJS() }
          >
            <View
              style={ [styles.mapMarker, styles.endMarker] }
            />
          </MapView.Marker>
        );
      } else {
        pins.push(
          <MapView.Marker
            key={ destination.get('dataPlaceId', destination.get('name')) }
            coordinate={ destination.get('coordinates', Map()).toJS() }
          >
            <View
              style={ [styles.mapMarker, styles.waypointMarker] }
            />
          </MapView.Marker>
        );
      }
    });
    return pins;
  };

  render() {
    const {
      destinations,
      currentLocation,
    } = this.props;
    const lastDestination = destinations.last() || Map();
    let longitude = lastDestination.getIn(['coordinates', 'longitude']);
    let latitude = lastDestination.getIn(['coordinates', 'latitude']);
    // Center map on the current location if it's opened
    // When the user hasn't input any destinations
    if (Map.isMap(currentLocation) && (!longitude || !latitude)) {
      longitude = currentLocation.get('longitude');
      latitude = currentLocation.get('latitude');
    }
    if (!longitude || !latitude) return null;
    const region = {
      ...mapRegion,
      longitude,
      latitude,
    };
    return (
      <View
        style={ styles.mapDimensions }
      >
        <MapView
          ref={ this.setMapRef }
          scrollEnabled={ false }
          // onLayout for iOS onMapReady for android
          onLayout={ this.fitMap }
          style={ styles.fitMap }
          initialRegion={ region }
        >
          { this.getDestinationWaypoints() }
          { this.getPolylines() }
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  device: {
    width: deviceWidth,
  },
  fitMap: {
    width: '100%',
    height: '100%',
  },
  mapDimensions: {
    width: mapWidth,
    height: mapHeight,
  },
  mapMarker: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  currentLocationMarker: {
    backgroundColor: 'yellow',
  },
  waypointMarker: {
    backgroundColor: 'blue',
  },
  startMarker: {
    backgroundColor: 'green',
  },
  endMarker: {
    backgroundColor: 'red',
  },
});
