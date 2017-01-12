// @flow
export default class Route {
  pageName : string
  pageTitle : string

  constructor(pageName : string, pageTitle : string) {
    this.pageName = pageName
    this.pageTitle = pageTitle
  }
}
