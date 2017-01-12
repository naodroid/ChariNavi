// @flow
import { ReduceStore, Dispatcher } from 'flux/utils'
import Toilet from '../entities/vending_machine'
import ToiletState from './vending_machine_state'
import Location from '../entities/location'

import locationStore from './location_store'
import LocationState from './location_state'
import dispatcher from '../dispatcher/dispatcher'

import * as LocationAction from '../actions/location_actions'
import * as ToiletAction from '../actions/toilet_actions'



//
class ToiletStore extends ReduceStore<ToiletState> {
  constructor(dispatcher : Dispatcher) {
    super(dispatcher)
  }
  getInitialState() : ToiletState {
    return new ToiletState()
  }
  reduce(state: ToiletState, action: Action) : ToiletState {
    if (action instanceof LocationAction.OnLocationReceived) {
      instance.requestList(action.location)
      return state
    }
    if (action instanceof ToiletAction.RequestList) {
      if (state.loading) {
        return state
      }
      return state.changeLoading(true)
    }
    if (action instanceof ToiletAction.OnListReceived) {
      const a : ToiletAction.OnListReceived = action
      return state.changeList(a.list).changeLoading(false)
    }
    if (action instanceof ToiletAction.OnFetchError) {
      return state.changeLoading(false)
    }
    return state
  }

  //---------------------------------------------
  //action creator
  requestListForCurrentLocation() : void {
    new ToiletAction.RequestList().dispatch()
    let state = locationStore.getState()
    if (state.location != null) {
        instance.requestList(state.location)
    } else {
        locationStore.requestLocation()
    }
  }
  requestList(location : Location) : void {
    //面倒だから緯度経度フィルタリングしない。URL長すぎというのも要因だけど。
    let url = "https://sparql.odp.jig.jp/api/v1/sparql?output=json&force-accept=text%2Fplain&query=PREFIX+rdf%3A%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0Aselect+*+%7B+%0D%0A%3Fs+rdf%3Atype+%3Chttp%3A%2F%2Fpurl.org%2Fjrrk%23PublicToilet%3E+%3B%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon%3B%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+%0D%0A+filter%28%28%3Flat+%3E%3D+35.70%29+%26%26+%28%3Flat+%3C%3D+36.0%29+%26%26+%3Flon+%3E%3D+136.20+%26%26+%3Flon+%3C%3D+136.50%29%0D%0A+OPTIONAL+%7B%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Floc%7D+%0D%0A+++filter+%28LANG%28%3Floc%29+%3D+%27ja%27%29%0D%0A%7D+%0D%0Alimit+200%0D%0A"

    fetch(url)
    .then(response => {
      return response.json()
    })
    .then(json => {
      let list = json.results.bindings
      return list.map((elem) => {
        return this.convert(elem, location)
      });
    }).then(list => {
      return list.sort((a, b) => {
        return a.distance - b.distance
      });
    }).then(list => {
      new ToiletAction.OnListReceived(list).dispatch()
    }, error => {
      new ToiletAction.OnFetchError(error).disptach()
    }).done();
  }
  convert(json : any, myLocation : Location) : Toilet {
    const name = json.loc.value
    const lat = parseFloat(json.lat.value)
    const lon = parseFloat(json.lon.value)
    const loc = new Location(lat, lon)
    const d = loc.distanceTo(myLocation)
    return new Toilet(name, loc, d)
  }

}

const instance = new ToiletStore(dispatcher)
export default instance
