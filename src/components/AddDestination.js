import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {
  Container,
  Button,
  Text,
  Body,
  ListItem,
} from 'native-base';

import LocationSearch from './LocationSearch';

import sharedStyles from './styles/sharedStyles';

export default class AddDestination extends React.Component {
  static propTypes = {
    handleSelectLocation: PropTypes.func.isRequired,
    numberOfDestinations: PropTypes.number.isRequired,
  };

  setRef = (ref) => { this.inputRef = ref; };

  handlePress = () => {
    this.inputRef && this.inputRef.triggerFocus();
  };

  render() {
    const {
      numberOfDestinations,
    } = this.props;
    let buttonText = 'Tap here to add a starting location';
    if (numberOfDestinations === 1) {
      buttonText = 'Tap here to add a destination';
    } else if (numberOfDestinations > 1) {
      buttonText = 'Tap here to add another destination';
    }
    return (
      <Container>
        <View style={ styles.view }>
          <Image
            source={ require('../../assets/backgroundIcon.png') }
            style={ styles.image }
            resizeMode="cover"
          >
            { numberOfDestinations >= 1 && (
              <ListItem style={ sharedStyles.listStackCorrection }>
                <Body>
                  <Text>Add {numberOfDestinations > 1 ? 'Another ' : ''}Destination</Text>
                </Body>
              </ListItem>
            ) }
            <LocationSearch
              setInputRef={ this.setRef }
              numberOfDestinations={ this.props.numberOfDestinations }
              handleSelectLocation={ this.props.handleSelectLocation }
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
});
