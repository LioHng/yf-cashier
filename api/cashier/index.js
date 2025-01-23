import HttpServe from '../http'

export function getCashierList() {
  return HttpServe.Get('/virtualCash/queryVirtualCashRegisterList')
}


export function cashierPay(data) {
  return HttpServe.Post('/ufanCashRegister/pay',data)
}