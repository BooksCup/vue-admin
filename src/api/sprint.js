import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取迭代列表
export function getSprintList(query) {
  return request({
    url: base_url + 'sprints',
    method: 'get',
    params: query
  })
}

// 创建迭代
export function createSprint(data) {
  return request({
    url: base_url + 'sprints',
    method: 'post',
    params: data
  })
}

// 编辑迭代
export function updateSprint(param) {
  return request({
    url: base_url + 'sprints/' + param.id,
    method: 'put',
    params: param
  })
}

// 删除迭代
export function deleteSprint(userId) {
  return request({
    url: base_url + 'sprints/' + userId,
    method: 'delete'
  })
}
