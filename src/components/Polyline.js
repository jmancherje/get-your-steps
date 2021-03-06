import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MapView } from 'expo';

export default class Polyline extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    activeIndex: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
    steps: PropTypes.array.isRequired, // eslint-disable-line
  };

  handlePress = () => {
    this.props.onPress(this.props.index);
  };

  render() {
    const { steps, index, activeIndex } = this.props;
    return (
      <MapView.Polyline
        onPress={ this.handlePress }
        coordinates={ steps }
        lineDashPattern={ index === activeIndex ? null : [10] }
        strokeWidth={ index === activeIndex ? 3 : 2 }
        strokeColor={ index === activeIndex ? '#3b9323' : '#e27ca5' }
      />
    );
  }
}
