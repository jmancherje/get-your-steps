import { connect } from 'react-redux';

import {
  getSavedRoutes,
} from '../selectors';

import {
  clearAllSavedRoutes,
} from '../actions';

import SavedRoutes from '../components/SavedRoutes';

const mapStateToProps = (state) => ({
  savedRoutes: getSavedRoutes(state),
});

export default connect(mapStateToProps, { clearAllSavedRoutes })(SavedRoutes);
