// @flow
import { Record, List } from 'immutable'
import Toilet from '../entities/toilet'
import Location from '../entities/location'


const ToiletStateRecord = Record({
  loading : false,
  list : null,
})

export default class ToiletState extends ToiletStateRecord {
  constructor() {
    super()
  }

  changeLoading(loading : bool) : ToiletState {
    return this.set('loading', loading)
  }
  changeList(list : List<Toilet>) : ToiletState {
    return this.set('list', list)
  }
}
