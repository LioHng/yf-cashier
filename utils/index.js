import modal from '@/plugins/modal.js'
/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

// 防抖
export function debounce(func, wait, immediate) {
  let timeout
  return function executedFunction(...args) {
    const context = this

    const later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)

    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}

/**
   * function multiply(a, b, c) { return a * b * c; }
   * const curriedMultiply = curry(multiply);
   * const result1 = curriedMultiply(2)(3)(4); // 24
   * const result2 = curriedMultiply(2, 3)(4); // 24
   * const result3 = curriedMultiply(2)(3, 4); // 24
   * @param {*} fn
   * @returns
   */
export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}
export const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n) // 是否是数字、包含'123'字符串的形式
export const isString = (p) => typeof p === 'string'
export const isObj = (obj) => Object.prototype.toString.call(obj) === '[object Object]' // 是否是{}对象
export const isArr = (obj) => Array.isArray(obj)
export const isEmpty = (val) => (val === null || val === undefined || val === '') // 是否为空值
export const noEmpty = (val) => !isEmpty(val) // 非空包含0
export const isZero = (val) => (val !== '' && +val === 0) // 是否等于0 包含 '0'
export const noZero = (val) => !isZero(val) // 非零
export const isStrHas = (str, val) => (str.indexOf(val) !== -1) // 某个字符串是否包含另一个字符串

export const numToFixed = (val, num = 2) => {
  if (isEmpty(val)) return ''
  return Number(val).toFixed(num)
}
/**
   * 对象赋值
   * @param {*} obj obj = { a: { b: {} } };
   * @param {*} key 'a.b.c'
   * @param {*} val 12
   * @result {*} obj => { a: { b: { c: 12 } } }
   * @returns
   */
export function setObjKeyVal(obj, keyValObj, prefix = '') {
  if (!isObj(obj) || !isObj(keyValObj)) {
    return
  }
  for (const key in keyValObj) {
    if (Object.prototype.hasOwnProperty.call(keyValObj, key)) {
      const val = keyValObj[key]
      const fullPath = prefix ? `${prefix}.${key}` : key
      const keys = fullPath.split('.')
      let current = obj

      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
          return false // 当找不到指定路径时，直接返回 false
        }
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = val
    }
  }
  return true // 所有操作成功完成
}

// 数字格式化 - 每3位加逗号分隔
export const number3Format = (val) => {
  if (isNumeric(val)) {
    return (val + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}

/**
 * 超过字数省略号展示
 * @param {*} val 字符串
 * @param {*} limit 限制的数量
 * @returns
 */
export const ellipsis = (val, limit) => {
  if (!val) return ''
  const len = val.length
  if (len > limit) {
    return val.slice(0, limit) + '...'
  } else {
    return val
  }
}

/**
 * 将数组里面的对象按属性进行分组
 * @param {*} arr
 * @param {*} prop
 * @returns
 *  let person = [{name: 'wbb', age: 18}, {name: 'lbb', age: 18}, {name: 'bb', age: 20}]
 *  groupBy(person, 'age')
 *
 *  {
 *    18: [{name: 'wbb', age: 18}, {name: 'lbb', age: 18}],
 *    20: [{name: 'bb', age: 20}]
 *  }
 */
export const groupBy = (arr, prop) => {
  const result = {}
  arr.forEach(item => {
    const key = item[prop]
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(item)
  })
  return result
}
// 将数字保留小数点后几位
export const formatToDecimal = (value, num) => {
  if (!value) return parseFloat(0).toFixed(num)
  return parseFloat(value).toFixed(num)
}

// 统一处理校验函数
export function verify(ruleList, isSync, handleFun) {
  const [flag, message, selfHandleFun, ...args] = ruleList.find((rule) => rule[0]) || [false]
  if (!flag) return
  // 发现校验不通过需要提示操作
  switch (flag) {
    // 想做单独的处理
    case Boolean(selfHandleFun):
      selfHandleFun(message, ...args)
      break
      // 统一处理函数
    case Boolean(handleFun):
      handleFun(message, ...args)
      break
      // 默认采用系统的方式
    default:
      modal.msg(message)
      break
  }
  if (isSync) {
    // 想要同步形式返回
    return message
  } else {
    // 想要以异步的形式返回
    return new Promise((res, rej) => {
      message ? rej(message) : res()
    })
  }
}

// 16进制颜色转rgba
export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
  }
  return 'rgba(' + r + ', ' + g + ', ' + b + ')'
}
