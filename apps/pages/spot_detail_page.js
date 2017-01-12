import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Navigator,
  View,
  Text,
  ScrollView,
  Image,
} from 'react-native'
import MapView from 'react-native-maps'

import Spot from '../entities/spot'
import Route from '../route/route'
import PinnedMapImage from '../views/pinned_map_image'

import locationStore from '../stores/location_store'
import commonStyles from '../styles/common_styles'

//------------------------------
type Props = {
  navigator : Navigator,
}
type State = {
}

class SpotDetailRoute extends Route {
  spot : Spot
  constructor(spot : Spot) {
    super(SpotDetailPage.pageName, spot.name)
    this.spot = spot
  }
}

export default class SpotDetailPage extends Component {
  props : Props
  state : State

  //static--------
  static get pageName() {
    return 'spot_detail_page'
  }
  static createRoute(spot : Spot) : Route {
    return new SpotDetailRoute(spot)
  }
  //render------
  render() {
    let spot = this.props.route.spot
    let loc = spot.location

    let imgs = spot.images.map(url =>
      (<Image style={styles.imageStyle} resizeMode='cover' key={url} source={{uri : url}}/>)
    )

    let myLocation = locationStore.getState().location
    var markers = []
    markers.push((<MapView.Marker
      key='Target'
      coordinate={loc}
      title={'対象の場所'}
    />))
    markers.push((<MapView.Marker
      key='Me'
      coordinate={myLocation}
      title={'現在地'}
    />))


    return (
      <View style={styles.container}>
        <View style={[commonStyles.mapContainer, {height : 180, zIndex : 1}]}>
          <MapView style={styles.map}
            initialRegion={{
              latitude: loc.latitude,
              longitude: loc.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}>
            {markers}
          </MapView>
        </View>
        <ScrollView style={[styles.scroll, {zIndex : 0}]}>
          <View style={styles.scrollContainer}>
            <Text style={styles.titleText}>{spot.name}</Text>
            <Text style={styles.subText}>{spot.comment}</Text>
            <Text style={styles.subText}>営業時間 : {spot.openingHours}</Text>
            <Text style={styles.subText}>定休日 : {spot.holiday}</Text>
            <Text style={styles.commentText}>{spot.description}</Text>
            {imgs}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    flexDirection : 'column',
    backgroundColor : '#FFF',
    paddingTop : (Platform.OS === 'ios') ? 64 : 0,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scroll: {
    flex: 1,
    backgroundColor : '#F4F4F4',
  },
  scrollContainer : {
    flexDirection : 'column',
    padding : 16,
  },
  titleText : {
    fontSize : 24,
    color : '#000',
    marginTop : 8,
    marginBottom : 8,
  },
  subText : {
    fontSize : 16,
    color : '#444',
    marginTop : 2,
  },
  commentText : {
    fontSize : 12,
    color : '#888',
    marginTop : 8,
  },
  imageStyle : {
    flex : 1,
    height : 160,
    marginTop : 8,
    marginBottom : 8,
  }
})
