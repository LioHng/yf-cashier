import HttpServe from './http'

// 登录方法
export function login(data) {
	return HttpServe.Post({
		url: `/virtualCash/login`,
		data
	})
}

// 获取用户详细信息
export function getInfo() {
	return HttpServe.get({
		url: '/system/auth/get-permission-info'
	})
}

// 退出方法
export function logout() {
	return  HttpServe.Post({
		url: '/system/auth/logout',
	})
}
