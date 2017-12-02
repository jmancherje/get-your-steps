import { List, Map } from 'immutable';
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Collapsible from 'react-native-collapsible';
import {
  List as NbList,
  ListItem,
  Text,
  Container,
  Content,
  Button,
  Grid,
  Col,
  Row,
} from 'native-base';

import { metersToMiles } from '../helpers/conversions';
import sharedStyles from './styles/sharedStyles';

const STEPS_PER_METER = 0.713;

class RouteHeader extends React.Component {
  static propTypes = {
    route: PropTypes.instanceOf(Map).isRequired,
  };
  state = {
    active: false,
  };
  handlePress = () => {
    this.setState({ active: !this.state.active });
  };
  render() {
    const { route } = this.props;
    console.log('route', route.toJS());
    return (
      <View>
        <ListItem
          style={ sharedStyles.listStackCorrection }
          onPress={ this.handlePress }
        >
          <Grid>
            <Row><Text>{ route.get('name') }</Text></Row>
            <Row><Text>{ `${Math.round(STEPS_PER_METER * (route.getIn(['route', 'distance'])))} Steps` }</Text></Row>
          </Grid>
        </ListItem>
        <Collapsible collapsed={ !this.state.active }>
          <ListItem style={ sharedStyles.listStackCorrection }>
            <Text>{ route.get('details') }</Text>
          </ListItem>
        </Collapsible>
      </View>
    );
  }
}


export default class SavedRoutes extends React.Component {
  static propTypes = {
    savedRoutes: PropTypes.instanceOf(List).isRequired,
    clearAllSavedRoutes: PropTypes.func.isRequired,
  };

  state = { activeIndex: null };

  activateIndex = (index) => {
    const nextIndex = index === this.state.activeIndex ? null : index;
    this.setState({ activeIndex: nextIndex });
  };

  render() {
    const { savedRoutes } = this.props;
    const placeholder = <ListItem style={ sharedStyles.listStackCorrection }><Text>You have no saved routes</Text></ListItem>;
    return (
      <Container>
        <Content>
          <NbList>
            { !savedRoutes.size ? placeholder : (
              savedRoutes.map(route => (
                <RouteHeader
                  route={ route }
                  key={ route.get('_wId') }
                />
              ))
            ) }
            { savedRoutes.size ? (
              <ListItem style={ sharedStyles.listStackCorrection }>
                <Button transparent onPress={ this.props.clearAllSavedRoutes }>
                  <Text>Clear all Saved Routes</Text>
                </Button>
              </ListItem>
            ) : null }
          </NbList>
        </Content>
      </Container>
    );
  }
}
