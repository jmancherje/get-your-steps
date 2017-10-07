import React, { Component } from 'react';
import {
  View,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import {
  Text,
  List,
  ListItem,
  Spinner,
} from 'native-base';
import { isEmpty } from 'lodash';

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
type State = {
  location: LocationObjectType,
  errorMessage: string,
};

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const mapWidth = deviceWidth;
const mapHeight = Math.round(deviceHeight / 3.8);
const aspectRatio = mapWidth / mapHeight;
// const LATITUDE_DELTA = 0.0015262294930451503;
const LATITUDE_DELTA = 0.0012299763249572493;
const LONGITUDE_DELTA = LATITUDE_DELTA * aspectRatio;

export default class LocationData extends Component {
  state: State;
  state = {
    location: {},
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
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
      this.setState({ location });
    });
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this.subscription = null;
  };

  _getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    const location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  // From user moving the map, not the user moving
  setMapRegionState = (region) => {
    // console.log('region', region);
    // this.setState({
    //   mapRegion: region,
    // });
  }

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (!isEmpty(this.state.location) && !isEmpty(this.state.location.coords)) {
      const coords = this.state.location.coords;
      text = `${coords.speed.toFixed(2)} m/s  lat: ${coords.latitude.toFixed(4)}  long: ${coords.longitude.toFixed(4)}`;
    }

    const { location } = this.state;
    if (isEmpty(location)) {
      return <Spinner />;
    }

    const mapRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };

    return (
      <View
        style={ { width: deviceWidth } }
      >
        <MapView
          style={ { width: mapWidth, height: mapHeight } }
          initialRegion={ mapRegion }
          region={ mapRegion }
          onRegionChange={ this.setMapRegionState }
        >
          <MapView.Marker
            coordinate={ {
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
            } }
            title="🖕😎🖕"
          >
            <View
              style={ styles.mapMarker }
            />
          </MapView.Marker>
        </MapView>
        <List>
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
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
