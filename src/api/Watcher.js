import fetch from '@/utils/fetch'

export const getWatchers = params => {
  return fetch({
    url: '/watchers',
    method: 'GET',
    params
  })
}

export const addWatcher = address => {
  return fetch({
    url: '/watchers',
    method: 'post',
    data: { address }
  })
}
