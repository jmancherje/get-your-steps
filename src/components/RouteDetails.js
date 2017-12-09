import React from 'react';
import { Map } from 'immutable';
import { View, StyleSheet, Alert } from 'react-native';
import PropTypes from 'prop-types';
import {
  ListItem,
  Text,
  Grid,
  Col,
  Row,
  CheckBox,
  Button,
  SwipeRow,
} from 'native-base';
import { Foundation } from '@expo/vector-icons';

import MapComponent from './MapComponent';
import sharedStyles from './styles/sharedStyles';
import getDetailsArrayFromRoute from '../helpers/getDetailsFromRoute';
import { metersToMiles } from '../helpers/conversions';

const STEPS_PER_METER = 0.713;

export default class RouteDetails extends React.Component {
  static propTypes = {
    savedRoute: PropTypes.instanceOf(Map).isRequired,
    isSelected: PropTypes.bool.isRequired,
    toggleSelection: PropTypes.func.isRequired,
    deleteRoute: PropTypes.func.isRequired,
  };

  state = {
    active: false,
  };

  handlePress = () => {
    this.setState({ active: !this.state.active });
  };

  handleCheckBoxPress = () => {
    this.props.toggleSelection(this.props.savedRoute.get('_wId'));
  };

  deleteRoute = () => {
    this.props.deleteRoute(this.props.savedRoute.get('_wId'));
  };

  handleDeletePress = () => {
    Alert.alert(
      'Delete Route?',
      null,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: this.deleteRoute },
      ],
      { cancelable: false }
    );
  };

  render() {
    const { savedRoute, isSelected } = this.props;
    const route = savedRoute.get('route');
    const { distance } = getDetailsArrayFromRoute(route);
    return (
      <View>
        <MapComponent
          scrollEnabled={ false }
          heightDivisor={ 5 }
          isHidden={ false }
          destinations={ savedRoute.get('destinations', Map()) }
          route={ route }
          shortMap
        />
        <ListItem
          style={ [sharedStyles.listStackCorrection, styles.listDetails] }
          onPress={ this.handlePress }
        >
          <SwipeRow
            style={ styles.swipeRow }
            disableRightSwipe
            rightOpenValue={ -75 }
            body={
              <Grid>
                <Col size={ 1 } style={ [sharedStyles.justifyCenter, styles.checkbox] } onPress={ this.handleCheckBoxPress }>
                  <CheckBox
                    checked={ isSelected }
                    onPress={ this.handleCheckBoxPress }
                  />
                </Col>
                <Col size={ 6 }>
                  <Row><Text style={ styles.routeName }>{ savedRoute.get('name') }</Text></Row>
                  <Row><Text style={ styles.routeDistance }>{ `${Math.round(STEPS_PER_METER * (distance))} Steps / ${metersToMiles(distance).toFixed(2)} miles` }</Text></Row>
                </Col>
                <Col size={ 2 } style={ styles.iconCol }>
                  <Foundation name="list" style={ styles.listIcon } />
                </Col>
              </Grid>
            }
            right={
              <Button danger onPress={ this.handleDeletePress }>
                <Foundation style={ styles.deleteIcon } name="trash" />
              </Button>
            }
          />
        </ListItem>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checkbox: {
    paddingHorizontal: 15,
  },
  detailsBtn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 0,
  },
  detailsBtnText: {
    fontSize: 13,
    color: '#007aff',
    marginRight: 0,
    position: 'absolute',
    right: 0,
  },
  swipeRow: {
    height: '100%',
    width: '100%',
  },
  listDetails: {
    borderTopWidth: 1,
    borderColor: '#e2e2e2',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  deleteIcon: {
    fontSize: 20,
  },
  listIcon: {
    fontSize: 15,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  routeDistance: {
    fontSize: 14,
  },
  iconCol: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
