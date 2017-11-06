import React, { Component } from 'react';
import { Map, List, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import {
  View,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import {
  Text,
  List as NbList,
  ListItem,
  Spinner,
} from 'native-base';

import {
  metersToFeet,
} from '../helpers/conversions';

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
const mapHeight = Math.round(deviceHeight / 3.8);
const aspectRatio = mapWidth / mapHeight;
const LATITUDE_DELTA = 0.0012299763249572493;
const LONGITUDE_DELTA = LATITUDE_DELTA * aspectRatio;

export default class LocationData extends Component {
  static propTypes = {
    realtimeLocationData: PropTypes.instanceOf(List).isRequired,
    locationErrorMessage: PropTypes.string.isRequired,
    setLocationData: PropTypes.func.isRequired,
    setLocationErrorMessage: PropTypes.func.isRequired,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.props.setLocationErrorMessage('Oops, this will not work on Sketch in an Android emulator. Try it on your device!');
    } else {
      this._getLocationAsync();
    }
  }

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Location.watchPositionAsync({
      enableHighAccuracy: true,
      timeInterval: 1, // 1ms minimum time interval before updating 😳
      distanceInterval: 1,
    }, (location) => {
      this.props.setLocationData(fromJS(location));
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this.subscription = null;
  };

  _getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.props.setLocationErrorMessage('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync({});
    this.props.setLocationData(fromJS(location));
  };

  render() {
    let text = 'Waiting..';
    const { realtimeLocationData, locationErrorMessage } = this.props;
    const locationData = realtimeLocationData.last() || Map();
    const coords = locationData.get('coords', Map());
    const latitude = coords.get('latitude', 0);
    const longitude = coords.get('longitude', 0);
    const speed = coords.get('speed', 0);
    if (locationErrorMessage) {
      text = locationErrorMessage;
    } else if (!coords.isEmpty()) {
      text = `${speed.toFixed(2)} m/s  lat: ${latitude.toFixed(4)}  long: ${longitude.toFixed(4)}`;
    }

    if (locationData.isEmpty()) {
      return <Spinner />;
    }

    const mapRegion = {
      latitude,
      longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    return (
      <View
        style={ styles.device }
      >
        <MapView
          style={ styles.mapDimensions }
          initialRegion={ mapRegion }
          region={ mapRegion }
        >
          <MapView.Marker
            coordinate={ {
              latitude,
              longitude,
            } }
            title="🖕😎🖕"
          >
            <View
              style={ styles.mapMarker }
            />
          </MapView.Marker>
        </MapView>
        <NbList>
          <ListItem
            itemDivider
            style={ styles.listDivider }
          >
            <Text
              style={ styles.listDividerText }
            >Speed and Position</Text>
          </ListItem>
          <ListItem>
            <Text>{text}</Text>
          </ListItem>
          <ListItem>
            <Text>Average Speed: { metersToFeet(locationData.get('averageSpeed', 0)).toFixed(2) } ft/s</Text>
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
});
