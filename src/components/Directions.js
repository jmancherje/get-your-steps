import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import {
  Spinner,
} from 'native-base';

import Route from '../constants/homeToWork.json';



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
const mapHeight = Math.round(deviceHeight - 200);
const aspectRatio = mapWidth / mapHeight;
const LATITUDE_DELTA = 0.0012299763249572493;
const LONGITUDE_DELTA = LATITUDE_DELTA * aspectRatio;

const mapRegion = {
  latitude: 37.779360,
  longitude: -122.409491,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
export default class Directions extends Component {
  constructor() {
    super();
    const route = Route.routes[0];
    // const bounds = route.bounds;
    const leg = route.legs[0];
    this.state = {
      distanceInMeters: leg.distance.value,
      duractionInMinutes: leg.duration.value,
      steps: [{
        latitude: leg.start_location.lat,
        longitude: leg.start_location.lng,
      }].concat(leg.steps.map(step => ({
        latitude: step.end_location.lat,
        longitude: step.end_location.lng,
      }))),
    };
  }
  render() {
    return (
      <View
        style={ styles.device }
      >
        <MapView
          style={ styles.mapDimensions }
          initialRegion={ mapRegion }
          region={ mapRegion }
        >
          {/* <MapView.Marker
            coordinate={ {
              latitude: 37.779360,
              longitude: -122.409491,
            } }
            title="🖕😎🖕"
          >
            <View
              style={ styles.mapMarker }
            />
          </MapView.Marker> */}
          <MapView.Polyline
            coordinates={ this.state.steps }
            strokeWidth={ 2 }
          />
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
  listDividerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  listDivider: {
    height: 30,
  },
});
