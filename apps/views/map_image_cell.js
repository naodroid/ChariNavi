import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableHighlight,
} from 'react-native'

import PinnedMapImage from './pinned_map_image'
import Location from '../entities/location'

import commonShadow from '../styles/common_shadow'
import elevations from '../styles/elevations'

//------------------------
type Props = {
  location : Location,
  name : string,
  distance : number,
  onPress : Function,
}
type State = {
}

export default class MapImageCell extends Component {
  props : Props
  state : State

  render() {
    const props = this.props
    const lat = props.location.latitude
    const lon = props.location.longitude

    return (
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor='#BBB'
        style={{flex : 1}}
        onPress={() => this.props.onPress()}
      >
        <View style={styles.cellParent}>
          <PinnedMapImage
            lat={lat} lon={lon}
            style={styles.cellMapImage}/>
          <View style={styles.cellTextArea}>
            <Text style={styles.cellName}>
              {this.props.name}
            </Text>
            <Text style={styles.cellDistance}>
              {Math.floor(this.props.distance.distance) + 'm'}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  cellParent: {
    height: 120,
    flexDirection : 'column',
    backgroundColor: '#FFF',
    margin: 8,
    elevation : elevations.contentsCell,
    ...commonShadow,
  },
  cellMapImage: {
    flex : 1,
    marginBottom : 20,
  },
  cellTextArea : {
    flexDirection : 'row',
    backgroundColor : '#FFF'
  },
  cellName : {
    flex : 1,
    fontSize : 14,
    color : '#222',
  },
  cellDistance: {
    fontSize : 12,
    color : '#222',
  }
})
