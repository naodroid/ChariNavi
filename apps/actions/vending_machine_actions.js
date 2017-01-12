// @flow
import Action from './action'
import { List } from 'immutable'

import VendingMachine from '../entities/vending_machine'

//
export class RequestList extends Action {

}
export class OnListReceived extends Action {
  list : List<VendingMachine>
  constructor(list : List<VendingMachine>) {
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
