import React, { Component } from 'react'
import {
  StyleSheet,
  Platform,
  Navigator,
  View,
  Text,
  Image,
  ListView,
  ActivityIndicator,
} from 'react-native';

import { List } from 'immutable'

import SpotDetailPage from './spot_detail_page'

import SpotImageCell from '../views/spot_image_cell'
import commonStyles, { cellStyles } from '../styles/common_styles'
import elevations from '../styles/elevations'

import SpotActions from '../actions/spot_actions'
import SpotStore from '../stores/spot_store'
import Spot from '../entities/spot'

import dispatcher from '../dispatcher/dispatcher'

//-------------------
type Props = {
  navigator : Navigator,
}
type State = {
  loading : boolean,
  list : List
}

export default class SpotListPage extends Component {
  props : Props
  state : State
  store : SpotStore
  storeSubscription : any

  constructor() {
    super()
    this.state = {
      loading : false,
      list : null,
    }
    this.store = new SpotStore(dispatcher)
  }
  componentDidMount() {
    this.store.requestListForCurrentLocation()
    this.storeSubscription = this.store.addListener(
      () => {this.onStateUpdated()},
      (error) => {}
    )
  }
  componentWillUnmount() {
    this.storeSubscription.remove()
  }
  //-----------------------------
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
    )
  }
  renderRow(item : Spot) {
    return (
      <SpotImageCell
        name={item.name}
        distance={item.distance}
        imageUrl={item.images[0]}
        onPress={() => this.onItemSelected(item)}
      />
    )
  }
  onItemSelected(item : Spot) {
    let route = SpotDetailPage.createRoute(item)
    this.props.navigator.push(route)
  }
  onStateUpdated() {
    const state = this.store.getState()
    this.setState({
      loading : state.loading,
      list : state.list,
    })
  }
}

//
const styles = StyleSheet.create({
  container : {
    flex : 1,
    flexDirection : 'column',
    backgroundColor : '#F4F4F4',
  },
})
