// @flow
import { Record } from 'immutable'
import { List } from 'immutable'
import Location from '../entities/location'
import Spot from '../entities/spot'


const SpotStateRecord = Record({
  'loading' : false,
  list : null,
  location : null,
})

export default class SpotState extends SpotStateRecord {

  changeLoading(loading : bool) : SpotState {
    return this.set('loading', loading)
  }
  changeList(list : List<Spot>) : SpotState {
    return this.set('list' , list)
  }
  changeLocation(location : Location) : SpotState {
    return this.set('location', location)
  }
}
