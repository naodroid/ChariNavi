// @flow

import { Record, List } from 'immutable'
import VendingMachine from '../entities/vending_machine'
import Location from '../entities/location'

const VendingMachineStateRecord = Record({
  loading : false,
  list : null,
})

export default class VendingMachineState extends VendingMachineStateRecord {
  constructor() {
    super()
  }

  changeLoading(loading : bool) : VendingMachineState {
    return this.set('loading', loading)
  }
  changeList(list : List<VendingMachine>) : VendingMachineState {
    return this.set('list', list)
  }
}
