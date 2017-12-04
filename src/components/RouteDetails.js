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
  CheckBox,
  Button,
} from 'native-base';

import MapComponent from './MapComponent';
import sharedStyles from './styles/sharedStyles';

const STEPS_PER_METER = 0.713;

export default class RouteDetails extends React.Component {
  static propTypes = {
    route: PropTypes.instanceOf(Map).isRequired,
    isSelected: PropTypes.bool.isRequired,
    toggleSelection: PropTypes.func.isRequired,
  };

  state = {
    active: false,
  };

  handlePress = () => {
    this.setState({ active: !this.state.active });
  };

  handleCheckBoxPress = () => {
    this.props.toggleSelection(this.props.route.get('_wId'));
  };

  handleDeletePress = () => {
    Alert.alert(
      'Delete Route?',
      this.props.route.g,
      [
        { text: 'Cancel', style: 'cancel' },
        // TODO action to delete this saved route
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
  };

  render() {
    const { route, isSelected } = this.props;
    return (
      <View>
        <ListItem
          style={ sharedStyles.listStackCorrection }
          onPress={ this.handlePress }
        >
          <Grid>
            <Col size={ 1 } style={ [sharedStyles.justifyCenter, styles.checkbox] } onPress={ this.handleCheckBoxPress }>
              <CheckBox
                checked={ isSelected }
                onPress={ this.handleCheckBoxPress }
              />
            </Col>
            <Col size={ 6 }>
              <Row><Text>{ route.get('name') }</Text></Row>
              <Row><Text>{ `${Math.round(STEPS_PER_METER * (route.getIn(['route', 'distance'])))} Steps` }</Text></Row>
            </Col>
            <Col
              size={ 3 }
              style={ styles.detailsBtn }
            >
              <Text style={ styles.detailsBtnText }>{ this.state.active ? 'hide details' : 'view details'}</Text>
            </Col>
          </Grid>
        </ListItem>
        <Collapsible collapsed={ !this.state.active }>
          <ListItem style={ sharedStyles.listStackCorrection }>
            { route.get('details') && <Text>{ route.get('details') }</Text> }
          </ListItem>
          <MapComponent
            scrollEnabled={ false }
            heightDivisor={ 5 }
            isHidden={ !this.state.active }
            destinations={ route.get('destinations', Map()) }
            route={ route }
          />
          <Button danger full onPress={ this.handleDeletePress }><Text>Delete Route</Text></Button>
        </Collapsible>
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
});
