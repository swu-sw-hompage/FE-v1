import { apiClient } from './client'

export const getNotices = async () => {
  const { data } = await apiClient.get('/notices')
  return data
}

export const getNoticeById = async (id) => {
  const { data } = await apiClient.get(`/notices/${id}`)
  return data
}
