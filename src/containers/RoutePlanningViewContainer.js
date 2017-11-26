import { connect } from 'react-redux';

import {
  updateShowMap,
} from '../actions/directions';

import RoutePlanningView from '../components/RoutePlanningView';
import { getIsShowingMap, hasDestinations } from '../selectors/directions';

const mapStateToProps = (state) => ({
  showMap: getIsShowingMap(state),
  hasDestinations: hasDestinations(state),
});

export default connect(mapStateToProps, {
  updateShowMap,
})(RoutePlanningView);
