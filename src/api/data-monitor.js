import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取task
export function fetchTask(query) {
  return request({
    url: base_url + 'tasks',
    method: 'get',
    params: query
  })
}

// 新增task
export function createTask(data) {
  return request({
    url: base_url + 'tasks',
    method: 'post',
    params: data
  })
}
