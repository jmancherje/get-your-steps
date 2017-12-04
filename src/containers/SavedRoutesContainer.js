import { connect } from 'react-redux';

import {
  getSavedRoutes,
} from '../selectors';

import {

  deleteRoute,
} from '../actions';

import SavedRoutes from '../components/SavedRoutes';

const mapStateToProps = (state) => ({
  savedRoutes: getSavedRoutes(state),
});

export default connect(mapStateToProps, {
  deleteRoute,
})(SavedRoutes);
