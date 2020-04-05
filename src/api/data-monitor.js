import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取task
export function fetchTask (query) {
  return request({
    url: base_url + 'tasks',
    method: 'get',
    params: query
  })
}

// 新增task
export function createTask (data) {
  return request({
    url: base_url + 'tasks',
    method: 'post',
    params: data
  })
}

// 获取邮件接收人列表
export function fetchMailReceiver (query) {
  return request({
    url: base_url + 'mails',
    method: 'get',
    params: query
  })
}

// 新增邮件接收人
export function createMailReceiver (data) {
  return request({
    url: base_url + 'mails',
    method: 'post',
    params: data
  })
}

// 删除邮件接收人
export function deleteMailReceiver (id) {
  return request({
    url: base_url + 'mails/' + id,
    method: 'delete'
  })
}
