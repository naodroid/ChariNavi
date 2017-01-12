/* @flow */
import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  ListView,
  TouchableHighlight,
} from 'react-native'

import { List } from 'immutable'

import VendingMachine from '../entities/vending_machine'
import LocationDetailPage from './location_detail_page'
import MapImageCell from '../views/map_image_cell'

import dispatcher from '../dispatcher/dispatcher'
import locationStore from '../stores/location_store'
import machineStore from '../stores/vending_machine_store'
import commonStyles from '../styles/common_styles'

//--------------------
type Props = {
  navigator : Navigator,
}
type State = {
  loading : boolean,
  list : List,
}

//--------------------------------------
export default class MachineListPage extends Component {
  props : Props
  state : State
  storeSubscription : Function

  constructor() {
    super();
    this.state = {
      loading : false,
      list: null,
    }
  }
  componentDidMount() {
    machineStore.requestListForCurrentLocation()
    this.storeSubscription = machineStore.addListener(
      () => {this.onListUpdated()},
      (error) => {},
    )
  }
  componentWillUnmount() {
    this.storeSubscription.remove()
  }

  render() {
    if (this.state.loading || this.state.list == null) {
      return (
        <View style={styles.container}>
          <ActivityIndicator color='#000' style={commonStyles.indicator}/>
        </View>
      );
    }

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <ListView
          style={commonStyles.listView}
          dataSource={ds.cloneWithRows(this.state.list)}
          renderRow={(item) => this.renderRow(item)}
        />
      </View>
    );
  }
  onListUpdated() {
    const state = machineStore.getState();
    this.setState({
      loading: state.loading,
      list: state.list
    })
  }
  renderRow(item: VendingMachine) {
    const lat = item.location.latitude
    const lon = item.location.longitude

    return (
      <MapImageCell
        location={item.location}
        name={item.name}
        distance={item.distance}
        onPress={() => this.onItemSelected(item)}
        />
    )
  }
  onItemSelected(item: VendingMachine) {
    let route = LocationDetailPage.createRoute('自販機詳細', item.name, item.location, item.distance)
    this.props.navigator.push(route)
  }
}


//
const styles = StyleSheet.create({
  container : {
    flex : 1,
    flexDirection : 'column',
    backgroundColor : '#FFF',
  },
})
