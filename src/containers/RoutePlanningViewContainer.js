import { connect } from 'react-redux';

import {
  resetDirections,
} from '../actions/directions';

import RoutePlanningView from '../components/RoutePlanningView';
import {  getNumberOfDestinations } from '../selectors/directions';

const mapStateToProps = (state) => ({
  numberOfDestinations: getNumberOfDestinations(state),
});

export default connect(mapStateToProps, {
  resetDirections,
})(RoutePlanningView);
