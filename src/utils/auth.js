import Cookies from 'js-cookie'

const key = 'token'

export const getToken = () => {
  return Cookies.get(key)
}

export const setToken = (token) => {
  return Cookies.set(key, token)
}

export const removeToken = () => {
  return Cookies.remove(key)
}
