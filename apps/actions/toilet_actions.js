// @flow
import Action from './action'
import { List } from 'immutable'

import Toilet from '../entities/toilet'

//
export class RequestList extends Action {

}
export class OnListReceived extends Action {
  list : List<Toilet>
  constructor(list : List<Toilet>) {
    super()
    this.list = list
  }
}

export class OnFetchError extends Action {
  error : Error
  constructor(error : Error) {
    super()
    this.error = error
  }
}
// {error : Error}
