import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Container,
  Button,
  Text,
  Body,
  Header,
} from 'native-base';

import LocationSearch from './LocationSearch';
import WaypointListItem from './WaypointListItem';

import sharedStyles from './styles/sharedStyles';

const { height: deviceHeight } = Dimensions.get('window');

export default class AddDestination extends React.Component {
  static propTypes = {
    handleSelectLocation: PropTypes.func.isRequired,
    destinations: PropTypes.instanceOf(List).isRequired,
    clearDestinationIndex: PropTypes.func.isRequired,
  };

  setRef = (ref) => { this.inputRef = ref; };

  handlePress = () => {
    this.inputRef && this.inputRef.triggerFocus();
  };

  render() {
    const {
      destinations,
      handleSelectLocation,
      clearDestinationIndex,
    } = this.props;
    const numberOfDestinations = destinations.size;
    let buttonText = 'Tap here to add a starting location';
    if (numberOfDestinations === 1) {
      buttonText = 'Tap here to add a destination';
    } else if (numberOfDestinations > 1) {
      buttonText = 'Tap here to add another destination';
    }
    return (
      <Container>
        <Header>
          <Body><Text style={ sharedStyles.header }>Create A Route</Text></Body>
        </Header>
        <View style={ styles.view }>
          <Image
            source={ require('../../assets/backgroundIcon.png') }
            style={ styles.image }
            resizeMode="cover"
          >
            { destinations.size ? (
              <View style={ styles.scrollViewHeight }>
                <ScrollView>
                  { destinations.map((destination, index) => (
                    <WaypointListItem
                      showDetails
                      key={ destination.get('_dId') || `key_${index}` }
                      clearDestinationIndex={ clearDestinationIndex }
                      destination={ destination }
                      index={ index }
                    />
                  )) }
                </ScrollView>
              </View>
            ) : null }
            <LocationSearch
              setInputRef={ this.setRef }
              numberOfDestinations={ numberOfDestinations }
              handleSelectLocation={ handleSelectLocation }
            />
            <Button full onPress={ this.handlePress }>
              <Text>{buttonText}</Text>
            </Button>
          </Image>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  view: {
    flex: 1,
  },
  scrollViewHeight: {
    maxHeight: (deviceHeight / 4),
  },
});
