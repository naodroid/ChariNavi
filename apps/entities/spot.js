// @flow

import Location from './location.js';

export default class Spot {
  name : string
  location : Location
  distance : number

  //optional
  comment : string
  openingHours : string
  images : Array<String>
  holiday : string
  price : string
  description : string

  constructor(name: string, location: Location, distance: number,
       comment : string, openingHours : string, image : string,
       holiday : string, price : string, description : string) {
    this.name = name
    this.location = location
    this.distance = distance
    this.comment = comment
    this.openingHours = openingHours
    this.images = [image]
    this.holiday = holiday
    this.price = price
    this.description = description
  }
  addImage(image: string) {
    this.images.push(image)
  }
}
