// @flow
import Action from './action'
import { List } from 'immutable'

import Spot from '../entities/spot'
import Location from '../entities/location'
//
export class RequestList extends Action {
  location : Location
  constructor(location : Location) {
    super()
    this.location = location
  }
}
export class OnListReceived extends Action {
  location : Location
  list : List<Spot>
  constructor(location : Location, list : List<Spot>) {
    super()
    this.location = location
    this.list = list
  }
}

export class OnFetchError extends Action {
  location : Location
  error : Error
  constructor(location : Location, error : Error) {
    super()
    this.location = location
    this.error = error
  }
}
// {error : Error}
