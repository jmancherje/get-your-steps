import React, { Component } from 'react';
import PropTypes from 'prop-types';;
import { MapView } from 'expo';

export default class Polyline extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    activeIndex: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
    // TODO make this more strict
    route: PropTypes.object.isRequired, // eslint-disable-line
  };

  handlePress = () => {
    this.props.onPress(this.props.index);
  };

  render() {
    const { route, index, activeIndex } = this.props;
    return (
      <MapView.Polyline
        onPress={ this.handlePress }
        coordinates={ route.steps }
        lineDashPattern={ index === activeIndex ? null : [10] }
        strokeWidth={ index === activeIndex ? 5 : 3 }
        strokeColor={ index === activeIndex ? '#3b9323' : '#e27ca5' }
      />
    );
  }
}
