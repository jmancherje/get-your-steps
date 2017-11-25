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
      <ListItem key={ destination.get('dataPlaceId') }>
        <Body>
          <Grid>
            <Col size={ 6 } style={ styles.justifyCenter }>
              <Text>{ `${index + 1}: ${destination.get('name')}` }</Text>
            </Col>
            <Col size={ 1 }>
              <Button
                small
                transparent
                onPress={ this.clearDirection }
              >
                <Text>X</Text>
              </Button>
            </Col>
          </Grid>
        </Body>
      </ListItem>
    );
  }
}

const styles = StyleSheet.create({
  justifyCenter: {
    justifyContent: 'center',
  },
});
