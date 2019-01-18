import fetch from '@/utils/fetch'

export const login = (mobile, password) => {
  return fetch({
    url: '/login',
    method: 'post',
    data: { mobile, password }
  })
}

export const register = data => {
  return fetch({
    url: '/register',
    method: 'post',
    data
  })
}
