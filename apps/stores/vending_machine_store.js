// @flow

import { ReduceStore, Dispatcher } from 'flux/utils'
import VendingMachine from '../entities/vending_machine'
import VendingMachineState from './vending_machine_state'
import Location from '../entities/location'

import locationStore from './location_store'
import dispatcher from '../dispatcher/dispatcher'

import * as LocationAction from '../actions/location_actions'
import * as MachineAction from '../actions/vending_machine_actions'



//
class VendingMachineStore extends ReduceStore<VendingMachineState> {
  constructor(dispatcher : Dispatcher) {
    super(dispatcher)
    this.self = this
  }
  getInitialState() : VendingMachineState {
    return new VendingMachineState()
  }
  reduce(state: VendingMachineState, action: Action) : VendingMachineState {
    if (action instanceof LocationAction.OnLocationReceived) {
      instance.requestList(action.location)
      return state
    }
    if (action instanceof MachineAction.RequestList) {
      if (state.loading) {
        return state
      }
      return state.changeLoading(true)
    }
    if (action instanceof MachineAction.OnListReceived) {
      const a : MachineAction.OnListReceived = action
      const list = a.list
      return state.changeList(list).changeLoading(false)
    }
    if (action instanceof MachineAction.OnFetchError) {
      return state.changeLoading(false)
    }
    return state
  }

  //---------------------------------------------
  //action creator
  requestListForCurrentLocation() : void {
    new MachineAction.RequestList().dispatch()

    let state = locationStore.getState()
    if (state.location != null) {
        instance.requestList(state.location)
    } else {
        locationStore.requestLocation()
    }
  }
  requestList(location : Location) : void {
    //面倒だから緯度経度フィルタリングしない。URL長すぎというのも要因だけど。
    const url = "https://sparql.odp.jig.jp/api/v1/sparql?output=json&force-accept=text%2Fplain&query=PREFIX+rdf%3A%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0Aselect+*+%7B+%0D%0A%3Fs+rdf%3Atype+%3Chttp%3A%2F%2Fodp.jig.jp%2Fodp%2F1.0%23VendingMachine%3E+%3B%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flong%3B%0D%0A%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+%0D%0A+filter%28%28%3Flat+%3E%3D+35.88%29+%26%26+%28%3Flat+%3C%3D+35.89%29%29%0D%0A+OPTIONAL+%7B%3Fs+%3Chttp%3A%2F%2Fodp.jig.jp%2Fodp%2F1.0%23location%3E+%3Floc%7D%0D%0A%7D+%0D%0Alimit+200"

    fetch(url)
    .then(response => {
      return response.json()
    })
    .then(json => {
      const list = json.results.bindings
      return list.map((elem) => {
        return this.convert(elem, location)
      })
    }).then(list => {
      return list.sort((a, b) => {
        return a.distance - b.distance
      })
    }).then(list => {
      new MachineAction.OnListReceived(list).dispatch()
    }).done()
  }
  convert(json : any, myLocation : Location) : VendingMachine {
    const name = json.loc.value
    const lat = parseFloat(json.lat.value)
    const lon = parseFloat(json.long.value)
    const loc = new Location(lat, lon)
    const d = loc.distanceTo(myLocation)
    return new VendingMachine(name, loc, d)
  }

}

const instance = new VendingMachineStore(dispatcher)
export default instance
