import Hanzo from '../mjs-fix/hanzo'

export default class Api {
  constructor(key, endpoint) {
    this.client = new Hanzo.Api({ key, endpoint })
  }
}

