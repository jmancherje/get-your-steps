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
import { Button, Text } from 'native-base';

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
    if (!routes.size && route.get('route')) {
      routes = List([route.get('route')]);
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
      // TODO: calculate the deltas using the viewport data with ...mapRegion as a fallback
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
          // scrollEnabled={ false }
          // onLayout for iOS onMapReady for android
          onLayout={ this.fitMap }
          style={ { width: '100%', height: '100%' } }
          initialRegion={ region }
        >
          <MapView.Marker
            coordinate={ { latitude, longitude } }
            title="Current Location"
          >
            <View
              style={ styles.mapMarker }
            />
          </MapView.Marker>
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
});
