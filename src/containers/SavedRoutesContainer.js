import { connect } from 'react-redux';

import {
  getSavedRoutes,
} from '../selectors/directions';

import SavedRoutes from '../components/SavedRoutes';

const mapStateToProps = (state) => ({
  savedRoutes: getSavedRoutes(state),
});

export default connect(mapStateToProps)(SavedRoutes);
