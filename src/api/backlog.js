import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 创建待办事项
export function createBacklog(data) {
  return request({
    url: base_url + 'backlogs',
    method: 'post',
    params: data
  })
}

// 获取待办事项列表
export function fetchBacklogList(query) {
  return request({
    url: base_url + 'backlogs',
    method: 'get',
    params: query
  })
}

// 删除待办事项
export function deleteBacklog(backlogId) {
  return request({
    url: base_url + 'backlogs/' + backlogId,
    method: 'delete'
  })
}

// 修改待办事项
export function updateBacklog(param) {
  return request({
    url: base_url + 'backlogs/' + param.id,
    method: 'put',
    params: param
  })
}
