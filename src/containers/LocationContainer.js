import { connect } from 'react-redux';

import {
  setLocationData,
  setLocationErrorMessage,
} from '../actions/location';

import {
  getLocationData,
  getLocationErrorMessage,
} from '../selectors/location';

import LocationData from '../components/LocationData';

const mapStateToProps = (state) => ({
  locationData: getLocationData(state),
  locationErrorMessage: getLocationErrorMessage(state),
});

export default connect(mapStateToProps, {
  setLocationData,
  setLocationErrorMessage,
})(LocationData);
