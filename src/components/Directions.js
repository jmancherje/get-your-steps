import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { MapView } from 'expo';
import {
  Text,
  Card,
  CardItem,
  Body,
  Button,
  Grid,
  Col,
} from 'native-base';

import { GOOGLE_DIRECTIONS_KEY as key } from '../../keys';

import LocationSearch from './LocationSearch';
import { metersToMiles } from '../helpers/conversions';

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
const mapHeight = Math.round(deviceHeight / 2);
const aspectRatio = mapWidth / mapHeight;
const LATITUDE_DELTA = 0.0012299763249572493;
const LONGITUDE_DELTA = LATITUDE_DELTA * aspectRatio;

const url = 'https://maps.googleapis.com/maps/api/directions/json?mode=walking';

const mapRegion = {
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
export default class Directions extends Component {
  static propTypes = {
    currentLocation: PropTypes.instanceOf(Map).isRequired,
    currentStepCount: PropTypes.number.isRequired,
    resetCurrentStepCount: PropTypes.func.isRequired,
  }

  state = {
    steps: [],
    distance: null,
  };

  setMapRef = (ref) => {
    this.map = ref;
  };

  fitMap = (steps = this.state.steps) => {
    if (!this.map || steps.length < 2) return;
    this.map.fitToCoordinates(steps, {
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

  resetMap = () => {
    this.setState({
      steps: [],
      distance: null,
    });
  };

  render() {
    // TODO: this is current location right when the app opens
    // We need realtime current location
    // And location at time of generating route
    const { currentLocation } = this.props;
    const longitude = currentLocation.get('longitude');
    const latitude = currentLocation.get('latitude');
    const region = {
      ...mapRegion,
      longitude,
      latitude,
    };
    return (
      <View style={ styles.device }>
        { !this.state.distance && <LocationSearch handleSelectLocation={ this.handleSelectLocation } /> }
        { longitude && latitude ? (
          <MapView
            ref={ this.setMapRef }
            style={ styles.mapDimensions }
            initialRegion={ region }
            // region={ region }
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
        ) : null }
        { this.state.distance && (
          <Card>
            <CardItem header>
              <Text>Estimated Steps To Walk To Destination</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Grid>
                  <Col size={ 5 }>
                    <Text>{ `${Math.round(this.state.distance / 0.724)} steps (for ${metersToMiles(this.state.distance).toFixed(2)} miles)` }</Text>
                  </Col>
                  <Col size={ 3 }>
                    <Button
                      small
                      transparent
                      onPress={ this.resetMap }
                    >
                      <Text>Reset Route</Text>
                    </Button>
                  </Col>
                </Grid>
              </Body>
            </CardItem>
          </Card>
        ) }
        <Card>
          <CardItem header>
            <Text>Realtime Step Count</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Grid>
                <Col size={ 5 }>
                  <Text>Total Steps: { this.props.currentStepCount }</Text>
                </Col>
                <Col size={ 3 }>
                  <Button
                    small
                    transparent
                    onPress={ this.props.resetCurrentStepCount }
                  >
                    <Text>Reset Steps</Text>
                  </Button>
                </Col>
              </Grid>
            </Body>
          </CardItem>
        </Card>
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
