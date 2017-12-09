import { connect } from 'react-redux';

import {
  saveRoute,
  resetDirections,
} from '../actions';

import SaveRouteForm from '../components/SaveRouteForm';

export default connect(null, {
  saveRoute,
  resetDirections,
})(SaveRouteForm);
