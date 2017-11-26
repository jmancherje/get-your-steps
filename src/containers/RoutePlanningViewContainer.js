import { connect } from 'react-redux';

import {
  updateShowMap,
} from '../actions/directions';

import RoutePlanningView from '../components/RoutePlanningView';
import { getIsShowingMap, getNumberOfDestinations } from '../selectors/directions';

const mapStateToProps = (state) => ({
  showMap: getIsShowingMap(state),
  numberOfDestinations: getNumberOfDestinations(state),
});

export default connect(mapStateToProps, {
  updateShowMap,
})(RoutePlanningView);
