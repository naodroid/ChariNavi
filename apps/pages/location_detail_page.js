// @flow

import React, { Component } from 'react'

import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  ListView,
  ActivityIndicator,
  TouchableHighlight,
  Navigator,
} from 'react-native'
import { List } from 'immutable'
import MapView from 'react-native-maps'

import SpotStore from '../stores/spot_store'
import SpotState from '../stores/spot_state'
import Spot from '../entities/spot'
import Location from '../entities/location'
import Route from '../route/route'
import SpotImageCell from '../views/spot_image_cell'
import SpotDetailPage from './spot_detail_page'

import dispatcher from '../dispatcher/dispatcher'
import locationStore from '../stores/location_store'
import commonStyles from '../styles/common_styles'
import elevations from '../styles/elevations'


//---------------------------------
type Props = {
  navigator : Navigator,
  route : LocationRoute,
}
type State = {
  loading : boolean,
  list : List,
}


class LocationRoute extends Route {
  itemName : string
  location : Location
  distance : number
  constructor(title: string, name : string, location: Location, distance : number) {
    super(LocationDetailPage.pageName, title)
    this.itemName = name
    this.location = location
    this.distance = distance
  }
}


//---------------------------------------------
export default class LocationDetailPage extends Component {
  store : SpotStore
  state : State
  props : Props
  storeSubscription : Function

  static get pageName() : string {
    return 'location_detail_page'
  }
  static createRoute(title: string, name : string, location: Location, distance : number): Route {
    return new LocationRoute(title, name, location, distance)
  }


  constructor() {
    super()
    this.state = {
      loading : false,
    }
  }

  componentDidMount() {
    let loc = this.props.route.location
    this.store = new SpotStore(loc, true)
    this.storeSubscription = this.store.addListener(() => {
      this.onStateUpdated()
    })
    this.store.requestListForCurrentLocation();
  }
  componentWillUnmount() {
    this.storeSubscription.remove()
  }

  render() {
    const route = this.props.route
    const loc = route.location
    const name = route.itemName
    const distance = Math.floor(route.distance) + 'm'

    let bottomView
    if (this.state.loading || this.state.list == null) {
      bottomView = (<ActivityIndicator style={commonStyles.indicator}/>)
    } else {
      const ds = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2})
      let list = ["", ...this.state.list]
      bottomView = (<ListView
        style={commonStyles.listView}
        dataSource={ds.cloneWithRows(list)}
        renderRow={(item) => this.renderRow(item)}
      />)
    }
    const myLocation = locationStore.getState().location
    let markers = []
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
        {//HeaderArea
        }
        <View style={[{flexDirection:'column', zIndex : 1, elevation : elevations.header}, commonStyles.mapContainer]}>
          <View style={{height : 180}}>
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
          <View style={[styles.description_area, {zIndex : 0}]}>
            <Text style={{flex : 1}}>{name}</Text>
            <Text>距離 : {distance}</Text>
          </View>
        </View>

        {//BottomArea
        }
        <View style={styles.bottom_view}>
          {bottomView}
        </View>
      </View>
    )
  }
  renderRow(item: any) {
    if (item instanceof Spot) {
      return (
        <SpotImageCell
          name={item.name}
          distance={item.distance}
          imageUrl={item.images[0]}
          onPress={() => this.onItemSelected(item)}
        />
      )
    }
    return (
      <Text style={{margin : 8}}>近隣の観光スポット</Text>
    )
  }
  onItemSelected(item: any) {
    if (item instanceof Spot) {
      let route = SpotDetailPage.createRoute(item)
      this.props.navigator.push(route)
    }
  }
  onStateUpdated() : void {
    let state = this.store.getState()
    this.setState({
      loading : state.loading,
      list : state.list,
    })
  }
}



const styles = StyleSheet.create({
  container: {
    flex : 1,
    flexDirection : 'column',
    backgroundColor : '#FFF',
    alignItems : 'stretch',
    paddingTop : (Platform.OS === 'ios') ? 64 : 0,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottom_view : {
    flex : 1,
    backgroundColor : '#F4F4F4',
  },
  description_area : {
    height : 30,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center',
    paddingLeft : 8,
    paddingRight : 8,
  },
  list : {
    flex : 1,
  },
})
