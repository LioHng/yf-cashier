const AccessTokenKey = 'TOKEN'
const RefreshTokenKey = 'REFRESH_TOKEN'

// ========== Token 相关 ==========

export function getAccessToken() {
  return uni.getStorageSync(AccessTokenKey)
}

export function getRefreshToken() {
  return uni.getStorageSync(RefreshTokenKey)
}

export function setToken(data) {
  uni.setStorageSync(AccessTokenKey, data.Token)
  // uni.setStorageSync(RefreshTokenKey, data.refreshToken)
}

export function removeToken() {
  uni.removeStorageSync(AccessTokenKey)
  uni.removeStorageSync(RefreshTokenKey)
}
