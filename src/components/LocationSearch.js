import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { GOOGLE_PLACES_KEY } from '../../keys';

export default class LocationSearch extends React.Component {
  static propTypes = {
    handleSelectLocation: PropTypes.func.isRequired,
  }

  handlePress = (data, details = null) => { // 'details' is provided when fetchDetails = true
    this.props.handleSelectLocation({
      data,
      details,
    });
  };

  renderDescription = row => row.description;

  renderLefttButton = () => <Text>Custom text after the input</Text>;

  renderRightButton = () => <Text>Where are you going</Text>;

  render() {
    return (
      <GooglePlacesAutocomplete
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
        styles={ {
          textInputContainer: {
            width: '100%',
          },
          description: {
            fontWeight: 'bold',
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        } }
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
        // renderLefttButton={ this.renderLefttButton }
        // renderRightButton={ this.renderRightButton }
      />
    );
  }
}
