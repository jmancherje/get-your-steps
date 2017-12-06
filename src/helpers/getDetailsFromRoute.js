import { List } from 'immutable';

export default (route) => {
  const steps = [];
  let distance = 0;
  route.get('legs', List()).forEach((leg, outerIndex) => {
    distance += leg.getIn(['distance', 'value'], 0);
    leg.get('steps', List()).forEach((step, innerIndex) => {
      if (outerIndex === 0 && innerIndex === 0) {
        const startLocation = step.get('start_location');
        steps.push({
          longitude: startLocation.get('lng'),
          latitude: startLocation.get('lat'),
        });
      }
      const endLocation = step.get('end_location');
      steps.push({
        longitude: endLocation.get('lng'),
        latitude: endLocation.get('lat'),
      });
    });
  });
  return { distance, steps };
};
