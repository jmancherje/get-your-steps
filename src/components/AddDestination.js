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
    startingPoint: PropTypes.bool,
    handleSelectLocation: PropTypes.func.isRequired,
    numberOfDestinations: PropTypes.number.isRequired,
    destinations: PropTypes.instanceOf(List),
  };

  static defaultProps = {
    startingPoint: false,
    destinations: List(),
  };

  setRef = (ref) => { this.inputRef = ref; };

  handlePress = () => {
    this.inputRef && this.inputRef.triggerFocus();
  };

  render() {
    const {
      destinations,
      numberOfDestinations,
    } = this.props;
    return (
      <Container>
        <View style={ styles.view }>
          <Image
            source={ require('../../assets/backgroundIcon.png') }
            style={ styles.image }
            resizeMode="cover"
          >
            { numberOfDestinations === 1 && (
              <ListItem style={ sharedStyles.listStackCorrection } key={ destinations.getIn([0, '_dId']) }>
                <Body>
                  <Text>Starting from {destinations.getIn([0, 'description'])}</Text>
                </Body>
              </ListItem>
            ) }
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
