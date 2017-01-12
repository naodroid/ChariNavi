// @flow
import React, {PropTypes, Component} from 'react'
import {
  StyleSheet,
  Navigator,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native'

import MachineListPage from './machine_list_page'
import ToiletListPage from './toilet_list_page'
import Route from '../route/route'
import commonShadow from '../styles/common_shadow'
import elevations from '../styles/elevations'

type Props = {
  navigator : Navigator,
  route : Route,
}
type State = {
  selectedTab: number
}

//---------------------------------------
export default class TopPage extends Component {
  props : Props
  state : State

  static get pageName() : string {
    return 'top_page'
  }
  static createRoute() : Route {
    return new Route(TopPage.pageName, "ChariNavi")
  }

  constructor() {
    super();
    this.state = {
      selectedTab : 0,
    }
  }

  render() {
    let page;
    if (this.state.selectedTab == 0) {
      page = (<MachineListPage navigator={this.props.navigator}/>);
    } else {
      page = (<ToiletListPage navigator={this.props.navigator}/>);
    }

    return (
      <View style={styles.container}>
        { page }
        <View style={[styles.tabArea, {zIndex : 1}]}>
          <TabArea
            title="自販機"
            image={require('../../img/ic_free_breakfast.png')}
            selected={this.state.selectedTab == 0}
            onPress={() => this.onTabSelected(0)}
            />
          <TabArea
            title="トイレ"
            image={require('../../img/ic_wc.png')}
            selected={this.state.selectedTab == 1}
            onPress={() => this.onTabSelected(1)}
            />
        </View>
      </View>
    );
  }
  onTabSelected(index: number) {
    this.setState({
      selectedTab : index,
    });
  }
}

type TabAreaProps = {
  title : string,
  image : any,
  selected : boolean,
  onPress : Function,
}
class TabArea extends Component {
  props : TabAreaProps

  render() {
    let color = this.props.selected ? "#07F" : "#000";

    return (
      <TouchableOpacity  style={{flex : 1}} onPress={this.props.onPress}>
        <View style={styles.tab}>
          <Image style={{tintColor : color}} source={this.props.image}/>
          <Text style={{color : color}}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : 'column',
    paddingTop : 64,
  },
  tabArea: {
    flexDirection : 'row',
    height : 44,
    backgroundColor : '#FFF',
    elevation : elevations.footer,
    ...commonShadow,
  },
  tab: {
    flex : 1,
    flexDirection : 'column',
    justifyContent : 'center',
    alignItems : 'center',
  },
});
