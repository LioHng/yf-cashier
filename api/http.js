import request from '@/utils/request'
import { isObj, isString } from '@/utils'

class HttpServe {
  request = request
  Get(...args) {
    return this.RequestWrapper(args, { method: 'GET' })
  }
  Post(...args) {
    return this.RequestWrapper(args, {
      method: 'POST',
      headers: {
        contentType: 'application/x-www-form-urlencoded'
      }
    })
  }
  PostJson(...args) {
    return this.RequestWrapper(args, {
      method: 'POST',
      headers: {
        contentType: 'application/json'
      }
    })
  }
  RequestWrapper(args, methodConfig) {
    const [firstArg, data = {}, config = ''] = args || []
    let argConfig = {}
    switch (true) {
      case isString(firstArg):
        argConfig = Object.assign({
          url: firstArg,
          data
        }, config)
        break
      case isObj(firstArg):
        argConfig = firstArg
        break
      default:
        argConfig = {}
    }
    return request(Object.assign({}, argConfig, methodConfig))
  }
}

export default new HttpServe()
