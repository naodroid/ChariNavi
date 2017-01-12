import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  TouchableHighlight,
} from 'react-native'

import commonShadow from '../styles/common_shadow'
import elevations from '../styles/elevations'
import {cellStyles} from '../styles/common_styles'

//------------------------
type Props = {
  name : string,
  distance : number,
  imageUrl : string,
  onPress : Function,
}
type State = {
}

export default class SpotImageCell extends Component {
  props : Props
  state : State

  render() {
    const props = this.props

    return (
      <TouchableHighlight
        activeOpacity={0.8}
        underlayColor='#BBB'
        style={{flex : 1}}
        onPress={() => this.props.onPress()}
      >
        <View style={[cellStyles.parent, {height : 160}]}>
          <Image
            source={{uri : props.imageUrl}}
            style={cellStyles.mainContent}/>
          <View style={cellStyles.textArea}>
            <Text style={cellStyles.name}>
              {this.props.name}
            </Text>
            <Text style={cellStyles.distance}>
              {Math.floor(this.props.distance) + 'm'}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}
