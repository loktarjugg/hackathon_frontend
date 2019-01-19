import fetch from '@/utils/fetch'

export const updateTag = (tag, id) => {
  return fetch({
    url: `/events/${id}/update-tag`,
    method: 'patch',
    data: { tag }
  })
}
