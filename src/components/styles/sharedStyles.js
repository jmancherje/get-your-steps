import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // StackNavigator leaves a default `backgroundColor: '#E9E9EF'
  // Correct this by changing ListItems default 10 marginLeft to 10 paddingLeft
  listStackCorrection: {
    marginLeft: 0,
    paddingLeft: 10,
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  header: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.9)',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  listDivider: {
    fontSize: 14,
  },
});
