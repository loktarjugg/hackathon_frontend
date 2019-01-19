import fetch from '@/utils/fetch'

export const getWatchers = params => {
  return fetch({
    url: '/watchers',
    method: 'GET',
    params
  })
}

export const getWatcher = id => {
  return fetch({
    url: `/watchers/${id}`,
    method: 'GET'
  })
}

export const addWatcher = address => {
  return fetch({
    url: '/watchers',
    method: 'post',
    data: { address }
  })
}

export const deleteWatcher = id => {
  return fetch({
    url: `/watchers/${id}`,
    method: 'delete'
  })
}

export const watcherAgain = id => {
  return fetch({
    url: `/watchers/${id}/watch-again`,
    method: 'post'
  })
}
