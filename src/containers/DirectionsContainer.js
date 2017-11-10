import { connect } from 'react-redux';

import {
  getCurrentLocation,
} from '../selectors/location';

import Directions from '../components/Directions';

const mapStateToProps = (state) => ({
  currentLocation: getCurrentLocation(state),
});

export default connect(mapStateToProps)(Directions);
