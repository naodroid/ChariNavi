// @flow
import Action from './action'

export class OnLocationReceived extends Action {
  location : Location
  constructor(location : Location) {
    super()
    this.location = location
  }
}
export class OnLocationError extends Action {
  error : Error
  constructor(error : Error) {
    super()
    this.error = error
  }
}
