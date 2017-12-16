import React from 'react';
import { Map } from 'immutable';
import { View, StyleSheet, Alert } from 'react-native';
import PropTypes from 'prop-types';
import Collapsible from 'react-native-collapsible';
import {
  ListItem,
  Text,
  Grid,
  Col,
  Row,
  Button,
  SwipeRow,
  Icon,
  Body,
  Right,
} from 'native-base';
import { Foundation, FontAwesome } from '@expo/vector-icons';

import MapComponent from './MapComponent';
import sharedStyles from './styles/sharedStyles';
import getDetailsArrayFromRoute from '../helpers/getDetailsFromRoute';
import { metersToMiles } from '../helpers/conversions';

export default class RouteDetails extends React.Component {
  static propTypes = {
    savedRoute: PropTypes.instanceOf(Map).isRequired,
    deleteRoute: PropTypes.func.isRequired,
    selectedCount: PropTypes.number.isRequired,
    removeSelection: PropTypes.func.isRequired,
    addSelection: PropTypes.func.isRequired,
    stepsPerMeter: PropTypes.number.isRequired,
  };

  addSelection = () => {
    this.props.addSelection(this.props.savedRoute.get('_wId'));
  };

  removeSelection = () => {
    this.props.removeSelection(this.props.savedRoute.get('_wId'));
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
    const { savedRoute, selectedCount, stepsPerMeter } = this.props;
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
        <Collapsible collapsed={ selectedCount === 0 }>
          <ListItem style={ { height: 30, marginLeft: 0, paddingLeft: 10, backgroundColor: '#ddffdf' } }>
            <Body><Text style={ { fontSize: 14 } }>{`Route added ${selectedCount} time${selectedCount > 1 ? 's' : ''}`}</Text></Body>
            <Right><Button danger small transparent onPress={ this.removeSelection }><Text style={ { paddingRight: 0, fontSize: 13 } }>Remove</Text></Button></Right>
          </ListItem>
        </Collapsible>
        <ListItem
          style={ [sharedStyles.listStackCorrection, styles.listDetails] }
        >
          <SwipeRow
            style={ styles.swipeRow }
            disableRightSwipe
            rightOpenValue={ -75 }
            body={
              <Grid>
                <Col size={ 1 } style={ [sharedStyles.justifyCenter, styles.checkbox] } onPress={ this.handleCheckBoxPress }>
                  <Button onPress={ this.addSelection } transparent style={ { width: 40, justifyContent: 'center' } }>
                    <FontAwesome name="plus-circle" style={ { fontSize: 35, color: '#62B1F6' } } />
                  </Button>
                </Col>
                <Col size={ 6 }>
                  <Row><Text style={ styles.routeName }>{ savedRoute.get('name') }</Text></Row>
                  <Row><Text style={ styles.routeDistance }>{ `${Math.round(distance / stepsPerMeter)} Steps / ${metersToMiles(distance).toFixed(2)} miles` }</Text></Row>
                </Col>
                <Col size={ 2 } style={ styles.iconCol }>
                  <Foundation name="list" style={ styles.listIcon } />
                </Col>
              </Grid>
            }
            right={
              <Button danger onPress={ this.handleDeletePress }>
                <Icon style={ styles.deleteIcon } name="trash" />
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
    borderBottomWidth: 1,
    borderColor: '#e2e2e2',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  deleteIcon: {
    fontSize: 35,
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
