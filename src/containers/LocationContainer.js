import { connect } from 'react-redux';

import {
  setLocationData,
  setLocationErrorMessage,
  setCurrentLocation,
} from '../actions';

import {
  getRealtimeLocationData,
  getLocationErrorMessage,
  getLatestLocationData,
} from '../selectors';

import LocationData from '../components/LocationData';

const mapStateToProps = (state) => ({
  realtimeLocationData: getRealtimeLocationData(state),
  locationErrorMessage: getLocationErrorMessage(state),
  latestLocationData: getLatestLocationData(state),
});

export default connect(mapStateToProps, {
  setLocationData,
  setLocationErrorMessage,
  setCurrentLocation,
})(LocationData);
