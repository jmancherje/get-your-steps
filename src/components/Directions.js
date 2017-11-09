import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { MapView } from 'expo';
import { Text } from 'native-base';

import { GOOGLE_DIRECTIONS_KEY as key } from '../../keys';

import LocationSearch from './LocationSearch';

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
const mapHeight = Math.round(deviceHeight - 500);
const aspectRatio = mapWidth / mapHeight;
const LATITUDE_DELTA = 0.0012299763249572493;
const LONGITUDE_DELTA = LATITUDE_DELTA * aspectRatio;

const url = 'https://maps.googleapis.com/maps/api/directions/json?mode=walking';

const mapRegion = {
  latitude: 37.779360,
  longitude: -122.409491,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
export default class Directions extends Component {
  static propTypes = {
    currentLocation: PropTypes.instanceOf(Map).isRequired,
  }

  state = {
    steps: [],
    distance: null,
  };

  setMapRef = (ref) => {
    this.map = ref;
  };

  fitMap = (steps = this.state.steps) => {
    const stepsCount = steps.length;
    if (!this.map || stepsCount < 2) return;
    this.map.fitToCoordinates([steps[0], steps[stepsCount - 1]], {
      edgePadding: { top: 15, right: 15, bottom: 15, left: 15 },
      animated: true,
    });
  };

  handleSelectLocation = ({ data, details }) => {
    const { currentLocation } = this.props;
    const placeId = data.place_id;
    const location = details.geometry.location;
    const destination = placeId ? `place_id:${placeId}` : `${location.latitude},${location.longitude}`;
    if (!destination) return;

    const currentLocationString = `${currentLocation.get('latitude')},${currentLocation.get('longitude')}`;
    const apiUrl = `${url}&origin=${currentLocationString}&destination=${destination}&key=${key}`;
    console.log('url', apiUrl);
    fetch(apiUrl)
      .then(res => res.json())
      .then(this.updateSteps);
  };

  updateSteps = (response) => {
    // NOTE: only handling the first route for now
    const route = response.routes[0];
    const leg = route.legs[0];
    const meters = leg.distance.value;
    const steps = [{
      latitude: leg.start_location.lat,
      longitude: leg.start_location.lng,
    }].concat(leg.steps.map(step => ({
      latitude: step.end_location.lat,
      longitude: step.end_location.lng,
    })));
    this.setState({ steps, distance: meters });
    this.fitMap(steps);
  };
  render() {
    const { currentLocation } = this.props;
    const longitude = currentLocation.get('longitude');
    const latitude = currentLocation.get('latitude');
    return (
      <View
        style={ styles.device }
      >
        <LocationSearch handleSelectLocation={ this.handleSelectLocation } />
        <MapView
          ref={ this.setMapRef }
          style={ styles.mapDimensions }
          initialRegion={ mapRegion }
          region={ mapRegion }
        >
          <MapView.Marker
            coordinate={ { latitude, longitude } }
            title="🖕😎🖕"
          >
            <View
              style={ styles.mapMarker }
            />
          </MapView.Marker>
          { this.state.steps.length ? (
            <MapView.Polyline
              coordinates={ this.state.steps }
              strokeWidth={ 2 }
            />
          ) : null }
        </MapView>
        { this.state.distance && <Text>{ `${this.state.distance} meters in ${this.state.distance / 0.724} steps` }</Text> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  device: {
    width: deviceWidth,
  },
  mapDimensions: {
    marginTop: 40,
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
