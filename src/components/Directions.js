import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, List, fromJS } from 'immutable';
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

const url = 'https://maps.googleapis.com/maps/api/directions/json?mode=walking&alternatives=true';

const mapRegion = {
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
export default class Directions extends Component {
  static propTypes = {
    currentLocation: PropTypes.instanceOf(Map).isRequired,
    currentStepCount: PropTypes.number.isRequired,
    resetCurrentStepCount: PropTypes.func.isRequired,
    updateActiveIndex: PropTypes.func.isRequired,
    updateSearchedRouteOptions: PropTypes.func.isRequired,
    resetActiveSearchedRoutes: PropTypes.func.isRequired,
    activeRouteIndex: PropTypes.number.isRequired,
    searchedRouteOptions: PropTypes.instanceOf(List).isRequired,
    updateDestinations: PropTypes.func.isRequired,
    destinations: PropTypes.instanceOf(List).isRequired,
  };

  setMapRef = (ref) => {
    this.map = ref;
  };

  fitMap = (steps = []) => {
    // NOTE this is expecting an array of objects, not a list of maps
    if (!this.map || steps.length < 2) return;
    this.map.fitToCoordinates(steps, {
      edgePadding: { top: 15, right: 15, bottom: 15, left: 15 },
      animated: true,
    });
  };

  // handleSelectLocation = ({ data, details }) => {
  //   const { currentLocation } = this.props;
  //   const placeId = data.place_id;
  //   const location = details.geometry.location;
  //   const destination = placeId ? `place_id:${placeId}` : `${location.latitude},${location.longitude}`;
  //   if (!destination) return;

  //   const currentLocationString = `${currentLocation.get('latitude')},${currentLocation.get('longitude')}`;
  //   const apiUrl = `${url}&origin=${currentLocationString}&destination=${destination}&key=${key}`;
  //   fetch(apiUrl)
  //     .then(res => res.json())
  //     .then(this.updateDirectionSteps);
  // };

  // updateDirectionSteps = (response) => {
  //   const routes = response.routes;
  //   if (!Array.isArray(routes) || routes.length < 1) return;

  //   const allRoutes = routes.reduce((steps, route) => {
  //     const leg = route.legs[0];
  //     const meters = leg.distance.value;
  //     const nextStep = {
  //       distance: meters,
  //       steps: [{
  //         latitude: leg.start_location.lat,
  //         longitude: leg.start_location.lng,
  //       }].concat(leg.steps.map(step => ({
  //         latitude: step.end_location.lat,
  //         longitude: step.end_location.lng,
  //       }))),
  //     };
  //     steps.push(nextStep);
  //     return steps;
  //   }, []);
  //   // NOTE: only handling the first route for now
  //   this.props.updateSearchedRouteOptions(fromJS(allRoutes));
  //   this.fitMap(allRoutes[0].steps);
  // };

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

  render() {
    const {
      currentLocation,
      activeRouteIndex,
      searchedRouteOptions,
    } = this.props;
    if (!searchedRouteOptions) return null;
    const longitude = currentLocation.get('longitude');
    const latitude = currentLocation.get('latitude');
    const region = {
      ...mapRegion,
      longitude,
      latitude,
    };
    const maplines = this.getPolylines();
    const activeRoute = searchedRouteOptions.get(activeRouteIndex, Map());
    const activeSteps = activeRoute.get('steps', List());
    return (
      <View style={ styles.device }>
        <Card>
          <CardItem>
            <Grid>
              <Col size={ 3 } style={ styles.justifyCenter }>
                <Text>Origin: Current Location</Text>
              </Col>
              <Col size={ 2 }>
                <Button small transparent>
                  <Text>Change Origin</Text>
                </Button>
              </Col>
            </Grid>
          </CardItem>
        </Card>
        {!activeRoute.has('distance') && <LocationSearch handleSelectLocation={ this.props.updateDestinations } leftButtonText="Destination" /> }
        { longitude && latitude ? (
          <MapView
            ref={ this.setMapRef }
            style={ styles.mapDimensions }
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
            { activeSteps.size ? maplines : null }
          </MapView>
        ) : null }
        { activeRoute.has('distance') && (
          <Card>
            <CardItem header>
              <Text>Estimated Steps To Walk To Destination</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Grid>
                  <Col size={ 5 } style={ styles.justifyCenter }>
                    <Text>{ `${Math.round(activeRoute.get('distance') / STEPS_PER_METER)} steps (for ${metersToMiles(activeRoute.get('distance')).toFixed(2)} miles)` }</Text>
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
                <Col size={ 5 } style={ styles.justifyCenter }>
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
  justifyCenter: {
    justifyContent: 'center',
  },
});
