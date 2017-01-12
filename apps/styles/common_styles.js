import { StyleSheet } from 'react-native'
import commonShadow from './common_shadow'
import elevations from './elevations'

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
const cellStyles = StyleSheet.create({
  parent: {
    height: 120,
    flexDirection : 'column',
    backgroundColor: '#FFF',
    margin: 8,
    elevation : elevations.contentsCell,
    ...commonShadow,
  },
  mainContent: {
    flex : 1,
    marginBottom : 20,
  },
  textArea : {
    flexDirection : 'row',
    backgroundColor : '#FFF'
  },
  name : {
    flex : 1,
    fontSize : 14,
    color : '#222',
  },
  distance: {
    fontSize : 12,
    color : '#222',
  }
})

export default commonStyles
export {
  cellStyles
}
