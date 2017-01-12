// @flow
import { Geolocation } from 'react-native'
import { ReduceStore } from 'flux/utils'
import Location from '../entities/location'
import LocationState from './location_state'
import dispatcher from '../dispatcher/dispatcher'

import * as LocationAction from '../actions/location_actions'


class LocationStore extends ReduceStore<LocationState> {
  getInitialState() : LocationState {
    return new LocationState()
  }
  reduce(state: LocationState, action: Action) : LocationState {
    if (action instanceof LocationAction.OnLocationReceived) {
      return state.changeLocation(action.location)
        .changeLocating(false)
    }
    if (action instanceof LocationAction.OnLocationError) {
      return state.changeLocating(false)
    }
    return state
  }

  //-----------------------------------
  //ActionCreator
  requestLocation() : void {
    navigator.geolocation.getCurrentPosition(
          (position) => {
            //use debug location for indoor-demo
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            if (lat < 35.7 || lat >= 36 || lon < 136.2 || lon >= 136.5) {
              lat = 35.8901548
              lon = 136.3429181
            }
            this.onLocationReceived(lat, lon)
          },
          (error) => {
            //use debug location for indoor-demo
            const lat = 35.8901548
            const lon = 136.3429181
            this.onLocationReceived(lat, lon)
          },
          {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000}
        );
  }

  onLocationReceived(latitude : number, longitude : number) : void {
    let loc = new Location(latitude, longitude)
    new LocationAction.OnLocationReceived(loc).dispatch()
  }
}

//
export default new LocationStore(dispatcher)
