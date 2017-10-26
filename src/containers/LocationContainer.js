import { connect } from 'react-redux';

import {
  setLocationData,
  setLocationErrorMessage,
} from '../actions/location';

import {
  getRealtimeLocationData,
  getLocationErrorMessage,
  getLatestLocationData,
} from '../selectors/location';

import LocationData from '../components/LocationData';

const mapStateToProps = (state) => ({
  realtimeLocationData: getRealtimeLocationData(state),
  locationErrorMessage: getLocationErrorMessage(state),
  latestLocationData: getLatestLocationData(state),
});

export default connect(mapStateToProps, {
  setLocationData,
  setLocationErrorMessage,
})(LocationData);
