// @flow

import { Record } from 'immutable'
import Location from '../entities/location.js'

const LocationStateRecord = Record({
  locating : false,
  location : null
})

export default class LocationState extends LocationStateRecord {
  constructor() {
    super()
  }
  hasLocation() : boolean {
    return this.location != null
  }

  changeLocating(locating : boolean) : LocationState {
    return this.set('locating', locating)
  }
  changeLocation(location: Location) : LocationState {
    return this.set('location', location)
  }
}
