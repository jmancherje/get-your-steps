import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {
  Container,
  Button,
  Text,
} from 'native-base';

import LocationSearch from './LocationSearch';

export default class AddDestination extends React.Component {
  static propTypes = {
    startingPoint: PropTypes.bool,
    handleSelectLocation: PropTypes.func.isRequired,
    numberOfDestinations: PropTypes.number.isRequired,
  };

  static defaultProps = {
    startingPoint: false,
  };

  setRef = (ref) => { this.inputRef = ref; };

  handlePress = () => {
    this.inputRef && this.inputRef.triggerFocus();
  };

  render() {
    return (
      <Container>
        <View style={ styles.view }>
          <Image
            source={ require('../../assets/backgroundIcon.png') }
            style={ styles.image }
            resizeMode="cover"
          >
            <LocationSearch
              setInputRef={ this.setRef }
              numberOfDestinations={ this.props.numberOfDestinations }
              handleSelectLocation={ this.props.handleSelectLocation }
            />
            <Button full onPress={ this.handlePress }>
              <Text>{this.props.startingPoint ? 'Tap here to get started' : 'Tap here to add destination'}</Text>
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
});
