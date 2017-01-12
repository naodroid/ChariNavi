import { StyleSheet } from 'react-native'
import commonShadow from './common_shadow'

const commonStyles = StyleSheet.create({
  defaultShadow: {
    shadowRadius : 4,
    shadowColor : '#000',
    shadowOffset : {width : 0, height : 0},
    shadowOpacity : 0.3,
    elevation : 3,
  },
  listView: {
    flex : 1,
    backgroundColor : '#F4F4F4',
  },
  indicator : {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  mapContainer : {
    backgroundColor : '#FFF',
    ...commonShadow,
  },

})

export default commonStyles
