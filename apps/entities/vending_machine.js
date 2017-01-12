// @flow

import Location from './location.js'

export default class VendingMachine {
  name : string
  location : Location
  distance : number

  constructor(name: string, location: Location, distance: number) {
    this.name = name
    this.location = location
    this.distance = distance
  }
}
