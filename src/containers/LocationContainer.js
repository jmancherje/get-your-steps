import { connect } from 'react-redux';

import {
  setLocationData,
  setLocationErrorMessage,
} from '../actions/location';

import {
  getRealtimeLocationData,
  getLocationErrorMessage,
} from '../selectors/location';

import LocationData from '../components/LocationData';

const mapStateToProps = (state) => ({
  realtimeLocationData: getRealtimeLocationData(state),
  locationErrorMessage: getLocationErrorMessage(state),
});

export default connect(mapStateToProps, {
  setLocationData,
  setLocationErrorMessage,
})(LocationData);
