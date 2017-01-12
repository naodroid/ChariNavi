// @flow

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  ListView,
  TouchableHighlight,
  Platform,
} from 'react-native'

import { List } from 'immutable'
import LocationDetailPage from './location_detail_page'
import MapImageCell from '../views/map_image_cell'
import Toilet from '../entities/toilet'

import dispatcher from '../dispatcher/dispatcher'
import locationStore from '../stores/location_store'
import toiletStore from '../stores/toilet_store'
import commonStyles from '../styles/common_styles'

type Props = {
  navigator: Navigator,
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
    super()
    this.state = {
      loading : false,
      list: null,
    }
  }
  componentDidMount() {
    if (this.state.list == null) {
     toiletStore.requestListForCurrentLocation();
    }
    this.storeSubscription = toiletStore.addListener(
      () => {this.onListUpdated()},
      (error) => {},
    );
  }
  componentWillUnmount() {
    this.storeSubscription.remove();
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
    let state = toiletStore.getState();
    this.setState({
      loading: state.loading,
      list: state.list
    });
  }
  renderRow(item: Toilet) {
    return (
      <MapImageCell
        location={item.location}
        name={item.name}
        distance={item.distance}
        onPress={() => this.onItemSelected(item)}
        />
    )
  }
  onItemSelected(item: Toilet) {
    let route = LocationDetailPage.createRoute('トイレ詳細', item.name, item.location, item.distance)
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
