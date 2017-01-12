// @flow
import dispatcher from '../dispatcher/dispatcher'

export default class Action {
  constructor() {
  }

  dispatch() {
    dispatcher.dispatch(this)
  }
}
