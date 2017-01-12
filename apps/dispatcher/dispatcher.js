// @flow

import {Dispatcher} from 'flux';
import Action from '../actions/action'

const dispatcher = new Dispatcher();

class AppDispatcher extends Dispatcher {

  queue : [Action]
  timerId : Number

  constructor() {
    super();
    this.queue = []
    this.timerId = null
  }

  //override
  dispatch(object : Action) : void {
    if (dispatcher.isDispatching() || this.queue.length > 0) {
      this.queue.push(object)
      this.startTimerIfNeeded()
    } else {
      super.dispatch(object)
    }
  }
  startTimerIfNeeded() : void {
    if (this.timerId != null) {
      return;
    }
    this.timerId = setTimeout(() => {
      if (this.queue.length == 0) {
        this.clearTimer(this.timerId);
      } else if (!dispatcher.isDispatching()) {
        let obj = this.queue[0]
        this.queue.shift()
        super.dispatch(obj)
      }
    }, 10)
  }
}

export default new AppDispatcher()
