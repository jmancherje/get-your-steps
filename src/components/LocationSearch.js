import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Text } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { GOOGLE_PLACES_KEY } from '../../keys';

const inputStyles = {
  textInputContainer: {
    width: '100%',
  },
  description: {
    fontWeight: 'bold',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
};

export default class LocationSearch extends React.Component {
  static propTypes = {
    handleSelectLocation: PropTypes.func.isRequired,
    leftButtonText: PropTypes.string.isRequired,
    index: PropTypes.number, // eslint-disable-line
  };

  ref = null;

  setRef = (ref) => {
    this.ref = ref;
  };

  handlePress = (data, details = null) => { // 'details' is provided when fetchDetails = true
    this.props.handleSelectLocation({
      data,
      details,
      index: this.props.index,
    });

    this.ref && this.ref.setAddressText('');
  };

  renderDescription = row => row.description;

  renderLeftButton = () => <View style={ styles.leftButton }><Text>{ this.props.leftButtonText }</Text></View>;

  render() {
    return (
      <GooglePlacesAutocomplete
        ref={ this.setRef }
        placeholder="Search"
        minLength={ 2 } // minimum length of text to search
        autoFocus={ false }
        /* returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype */
        listViewDisplayed="auto" // true/false/undefined
        fetchDetails
        renderDescription={ this.renderDescription } // custom description render
        onPress={ this.handlePress }
        // getDefaultValue={() => ''}
        query={ {
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: GOOGLE_PLACES_KEY,
          language: 'en', // language of the results
          // types: 'address', // default: 'geocode'
        } }
        styles={ inputStyles }
        // currentLocation // Will add a 'Current location' button at the top of the predefined places list
        // currentLocationLabel="Current location"
        nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={ {
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        } }
        GooglePlacesSearchQuery={ {
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'food',
        } }
        filterReverseGeocodingByTypes={ ['locality', 'administrative_area_level_3'] } // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        // predefinedPlaces={ [homePlace, workPlace] }
        debounce={ 200 } // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        renderLeftButton={ this.renderLeftButton }
        // renderRightButton={ this.renderRightButton }
      />
    );
  }
}

const styles = StyleSheet.create({
  leftButton: { paddingLeft: 10, justifyContent: 'center' },
});
