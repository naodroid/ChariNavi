// @flow

import React, { Component } from 'react'

import {
  Navigator,
  BackAndroid,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native'

import Route from '../route/route'
import TopPage from './top_page.js'
import LocationDetailPage from './location_detail_page'
import SpotDetailPage from './spot_detail_page'
import commonShadow from '../styles/common_shadow'
import elevations from '../styles/elevations'

type Props = {
}
type State = {
}

//---------------------------------
export default class RoutePage extends Component {
  props : Props
  state : State
  navigator : Navigator
  backListener : Function

  componentDidMount() {
    if (Platform.OS == "android") {
      let self = this
      this.backListener = () => {
        if (self.navigator !== 'undefined') {
          let l = self.navigator.getCurrentRoutes()
          if (l.length > 1) {
            self.navigator.pop()
            return true
          }
          return false
        }
      }
      BackAndroid.addEventListener("backPress", this.backListener)
    }
  }
  componentWillUnmount() {
    if (Platform.OS == "android") {
      BackAndroid.removeEventListener("backPress", this.backListener)
    }
  }


  render() {
    return (
      <Navigator
        ref={(nav) => {this.navigator = nav}}
        initialRoute={TopPage.createRoute()}
        renderScene={(route, navigator) => this.renderScene(route, navigator)}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={{
              LeftButton: (route, navigator, index, navState) =>
                this.renderLeftButton(route, navigator, index, navState),
              RightButton: (route, navigator, index, navState) =>
                null,
              Title: (route, navigator, index, navState) =>
                this.renderTitle(route, navigator, index, navState),
            }}
            style={[styles.navBar, {zIndex: 3}]}
          />
        }
      />
    )
  }
  renderScene(route : Route, navigator : Navigator) {
    let pageName = route.pageName
    if (pageName == TopPage.pageName) {
      return (
        <TopPage navigator={navigator} route={route}/>
      )
    }
    if (pageName == LocationDetailPage.pageName) {
      return (
        <LocationDetailPage navigator={navigator} route={route}/>
      )
    }
    if (pageName == SpotDetailPage.pageName) {
      return (
        <SpotDetailPage navigator={navigator} route={route}/>
      )
    }
    return null
  }
  renderLeftButton(route : any, navigator : Navigator, index : number, navState : any) {
    if (index == 0) {
      return null
    }
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={() => navigator.pop()} style={{flex:1}}>
        <View style={styles.buttonContainer}>
          <Text style={styles.button}>&lt;</Text>
        </View>
      </TouchableOpacity>
    )
  }
  renderTitle(route : Route, navigator : Navigator, index : number, navState : any) {
    return (
      <View style={styles.titleContainer}>
        <Image source={require('../../img/ic_directions_bike.png')}/>
        <Text style={styles.titleText}>
          {route.pageTitle}
        </Text>
      </View>
    )
  }


}

const styles = StyleSheet.create({
  navBar : {
    backgroundColor : '#FFF',
    paddingTop : (Platform.OS === 'ios') ? 20 : 0,
    ...commonShadow,
    elevation : elevations.header,
  },
  buttonContainer : {
    flex : 1,
    width : 44,
    alignItems: 'center',
    justifyContent : 'center',
    backgroundColor : '#00000000',
  },
  button : {
    color : '#07F',
    fontSize : 30,
  },
  titleContainer: {
    flex : 1,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent: 'center',
  },
  titleText : {
    fontSize : 24,
  }
})
