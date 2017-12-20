import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import {
  StyleSheet,
} from 'react-native';
import {
  ListItem,
  Body,
  Button,
  Right,
  Text,
} from 'native-base';
import sharedStyles from './styles/sharedStyles';

export default class WaypointListItem extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    destination: PropTypes.instanceOf(Map).isRequired,
    clearDestinationIndex: PropTypes.func.isRequired,
    showDetails: PropTypes.bool,
  };

  static defaultProps = {
    showDetails: false,
  };

  clearDirection = () => {
    this.props.clearDestinationIndex(this.props.index);
  };

  render() {
    const {
      index,
      destination,
      showDetails,
    } = this.props;
    let text = destination.get('name');
    if (showDetails) {
      text = destination.get('description', destination.get('name'));
    }
    return (
      <ListItem style={ [sharedStyles.listStackCorrection, styles.listItem] }>
        <Body>
          <Text>{ `${index + 1}: ${text}` }</Text>
        </Body>
        <Right>
          <Button
            small
            transparent
            danger
            onPress={ this.clearDirection }
          >
            <Text style={ styles.removeBtn }>Remove</Text>
          </Button>
        </Right>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    marginRight: 0,
    paddingRight: 0,
  },
  removeBtn: {
    paddingLeft: 0,
    paddingRight: 10,
    alignItems: 'flex-end',
  },
});
