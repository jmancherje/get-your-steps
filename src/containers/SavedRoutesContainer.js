import { connect } from 'react-redux';

import {
  getSavedRoutes,
} from '../selectors/directions';

import {
  clearAllSavedRoutes,
} from '../actions/directions';

import SavedRoutes from '../components/SavedRoutes';

const mapStateToProps = (state) => ({
  savedRoutes: getSavedRoutes(state),
});

export default connect(mapStateToProps, { clearAllSavedRoutes })(SavedRoutes);
