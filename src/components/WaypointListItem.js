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
  Grid,
  Col,
  Text,
} from 'native-base';
import sharedStyles from './styles/sharedStyles';

export default class WaypointListItem extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    destination: PropTypes.instanceOf(Map).isRequired,
    clearDestinationIndex: PropTypes.func.isRequired,
  };

  clearDirection = () => {
    this.props.clearDestinationIndex(this.props.index);
  };

  render() {
    const {
      index,
      destination,
    } = this.props;
    return (
      <ListItem style={ [sharedStyles.listStackCorrection, styles.listItem] }>
        <Body>
          <Grid>
            <Col size={ 6 } style={ sharedStyles.justifyCenter }>
              <Text>{ `${index + 1}: ${destination.get('name')}` }</Text>
            </Col>
            <Col size={ 2 } style={ sharedStyles.justifyCenter }>
              <Button
                small
                transparent
                danger
                onPress={ this.clearDirection }
              >
                <Text>Remove</Text>
              </Button>
            </Col>
          </Grid>
        </Body>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  listItem: {
    height: 30,
    marginRight: 0,
    paddingRight: 0,
  },
});
