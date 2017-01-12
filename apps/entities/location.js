// @flow

const BESSEL_A = 6377397.155
const BESSEL_E2 = 0.00667436061028297
const BESSEL_MNUM = 6334832.10663254

export default class Location {
  latitude : number
  longitude : number
  constructor(latitude: number, longitude: number) {
    this.latitude = latitude
    this.longitude = longitude
  }



  distanceTo(other: Location) : number {
    return Location.calcDistance(this.latitude, this.longitude, other.latitude, other.longitude)
  }

  //
  static deg2rad(deg: number) : number {
    return deg * Math.PI / 180.0
  }
  //二点間の距離を計算する。メートル単位でかえる
  //http://yamadarake.jp/trdi/report000001.html
  static calcDistance(lat1 : number, lng1 : number,
      lat2 : number, lng2 : number) : number {
    let my = Location.deg2rad((lat1 + lat2) / 2.0)
    let dy = Location.deg2rad(lat1 - lat2)
    let dx = Location.deg2rad(lng1 - lng2)

    let sinVal = Math.sin(my)
    let w = Math.sqrt(1.0 - BESSEL_E2 * sinVal * sinVal)
    let m = BESSEL_MNUM / (w * w * w)
    let n = BESSEL_A / w

    let dym = dy * m
    let dxncos = dx * n * Math.cos(my)

    return Math.sqrt(dym * dym + dxncos * dxncos)
  }
}
