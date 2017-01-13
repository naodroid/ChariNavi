// @flow
import { ReduceStore, List } from 'flux/utils'
import Location from '../entities/location'
import Spot from '../entities/spot'
import SpotState from './spot_state'

import dispatcher from '../dispatcher/dispatcher'
import locationStore from './location_store'

import * as SpotAction from '../actions/spot_actions'
import * as LocationAction from '../actions/location_actions'

export default class SpotStore extends ReduceStore<SpotState> {
  requireImage : boolean
  constructor(location : Location, requireImage: boolean) {
    super(dispatcher)
    this.location = location
    this.requireImage = requireImage
  }
  getInitialState() : SpotState {
    return new SpotState().changeLocation(this.location)
  }
  reduce(state : SpotState, action : Action) : SpotState {
    if (action instanceof LocationAction.OnLocationReceived) {
      this.location = state.location
      this.requestList()
      return state
    }
    if (action instanceof SpotAction.RequestList) {
      const a :SpotAction.RequestList = action
      return state.changeLoading(true).changeLocation(a.location)
    }
    if (action instanceof SpotAction.OnListReceived) {
      const a : SpotAction.OnListReceived = action
      if (a.location != state.location) {
        return state
      }
      return state.changeList(a.list).changeLoading(false)
    }
    if (action instanceof SpotAction.OnFetchError) {
      const a : SpotAction.FetchError = action
      if (a.location != state.location) {
        return state
      }
      return state.changeLoading(false)
    }
    return state
  }

  //action creators--------------------------
  requestListForCurrentLocation() : void {
    new SpotAction.RequestList().dispatch()
    let state = locationStore.getState()
    if (state.location != null) {
      this.location = state.location
      this.requestList(state.location)
    } else {
      locationStore.requestLocation()
    }
  }
  requestList() : void {
    const location = this.location
    new SpotAction.RequestList(location).dispatch()

    const url = "https://sparql.odp.jig.jp/data/sparql"

    let query : string
    if (this.requireImage) {
      query = "\
        PREFIX jrrk:<http://purl.org/jrrk#>\
        PREFIX rdf:<http://www.w3.org/2000/01/rdf-schema#>\
        PREFIX geo:<http://www.w3.org/2003/01/geo/wgs84_pos#>\
        PREFIX schema:<http://schema.org/>\
        PREFIX odp:<http://odp.jig.jp/odp/1.0#>\
        \
        select * {\
          ?s jrrk:jenre <http://odp.jig.jp/res/jenre/%E9%81%8A%E3%81%B6> ;\
          rdf:label ?label ;\
          geo:lat ?lat ;\
          geo:long ?lon ;\
          schema:image ?image.\
          filter(LANG(?label)='ja' && ?lat >= 35.5 && ?lat <= 36) .\
          \
          OPTIONAL { ?s rdf:comment ?comment } .\
          OPTIONAL { ?s jrrk:openingHours ?openingHours }.\
          OPTIONAL { ?s odp:regularHoliday ?holiday } .\
          OPTIONAL { ?s schema:price ?price }.\
          OPTIONAL { ?s schema:description ?desc filter(LANG(?desc)='ja')} .\
        } limit 100\
        "
    } else {
      query = "\
        PREFIX jrrk:<http://purl.org/jrrk#>\
        PREFIX rdf:<http://www.w3.org/2000/01/rdf-schema#>\
        PREFIX geo:<http://www.w3.org/2003/01/geo/wgs84_pos#>\
        PREFIX schema:<http://schema.org/>\
        PREFIX odp:<http://odp.jig.jp/odp/1.0#>\
        \
        select * {\
          ?s jrrk:jenre <http://odp.jig.jp/res/jenre/%E9%A3%9F%E3%81%B9%E3%82%8B> ;\
          rdf:label ?label ;\
          geo:lat ?lat ;\
          geo:long ?lon ;\
          filter(LANG(?label)='ja' && ?lat >= 35.5 && ?lat <= 36) .\
          \
          OPTIONAL { ?s rdf:comment ?comment } .\
          OPTIONAL { ?s jrrk:openingHours ?openingHours }.\
          OPTIONAL { ?s odp:regularHoliday ?holiday } .\
          OPTIONAL { ?s schema:price ?price }.\
          OPTIONAL { ?s schema:image ?image }.\
          OPTIONAL { ?s schema:description ?desc filter(LANG(?desc)='ja')} .\
        } limit 100\
        "

    }
    let sendData = "query=" + encodeURIComponent(query)

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/sparql-results+json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: sendData,
    })
      .then(response => response.json())
      .then(json => {
        let list = json.results.bindings
        return list.map((elem) => {
          return this.convert(elem, location)
        })
      })
      .then(list => SpotStore.joinSameImage(list))
      .then(list => {
        return list.sort((a, b) => a.distance - b.distance)
      })
      .then(list => {
        new SpotAction.OnListReceived(location, list).dispatch()
      }, error => {
        new SpotAction.OnFetchError(location, error).dispatch()
      })
      .done()
  }
  static joinSameImage(list : Array<Spot>) : Array<Spot> {
    var ret : Array<Spot> = []
    for (var s of list) {
      var find = false
      for (var i = 0; i < ret.length; i++) {
        let s2 = ret[i]
        if (s2.name === s.name) {
          s2.addImage(s.images[0])
          find = true
          break
        }
      }
      if (!find) {
        ret.push(s)
      }
    }
    return ret
  }

  convert(json : any, targetLocation : Location) : Spot {
    let name = json.label.value
    let lat = parseFloat(json.lat.value)
    let lon = parseFloat(json.lon.value)
    let comment = SpotStore.readOptStringValue(json, 'comment')
    let openingHours = SpotStore.readOptStringValue(json, 'openingHours')
    let image = SpotStore.readOptStringValue(json, 'image')
    let holiday = SpotStore.readOptStringValue(json, 'holiday')
    let price = SpotStore.readOptStringValue(json, 'price')
    let desc = SpotStore.readOptStringValue(json, 'desc')

    let loc = new Location(lat, lon)
    let d = loc.distanceTo(targetLocation)
    return new Spot(name, loc, d, comment, openingHours, image, holiday, price, desc)
  }
  static readOptStringValue(json : any, key : string) : string {
    let r : any = json[key]
    return (typeof r === 'undefined') ? '' : r.value
  }
}
