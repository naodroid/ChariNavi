import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
} from 'react-native'

export default class PinnedMapImage extends Component {
  render() {
    let lat = this.props.lat
    let lon = this.props.lon
    let url = "https://maps.google.com/maps/api/staticmap?center=" + lat + "," + lon + "&size=320x140&zoom=15&sensor=false"

    return (
      <View style={styles.container}>
        <Image style={styles.mapImage} source={{uri : url}} resizeMode={'contain'}/>
        <Image style={styles.pin} source={require('../../img/pin_image.png')}/>
      </View>
    );
  }
}
PinnedMapImage.propTypes = {
  lat : React.PropTypes.number,
  lon : React.PropTypes.number,
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    alignItems: 'center',
    justifyContent : 'center',
  },
  mapImage : {
    flex : 1,
    position : 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 1,
  },
  pin : {
    width : 15,
    height: 24,
  },
})
