import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取token及配置信息
export function fetchToken(query) {
  return request({
    url: base_url + 'econtractToken',
    method: 'get',
    params: query
  })
}

// 新增token
export function addToken(data) {
  return request({
    url: base_url + 'econtractToken',
    method: 'post',
    params: data
  })
}

// 获取个人账号
export function fetchAccount(query) {
  return request({
    url: base_url + 'econtractAccount',
    method: 'get',
    params: query
  })
}

// 新增个人账号
export function createAccount(data) {
  return request({
    url: base_url + 'econtractAccount',
    method: 'post',
    params: data
  })
}

// 删除个人账号
export function deleteAccount(accountId) {
  return request({
    url: base_url + 'econtractAccount/' + accountId,
    method: 'delete'
  })
}

// 编辑个人账号
export function updateAccount(param) {
  return request({
    url: base_url + 'econtractAccount/' + param.id,
    method: 'put',
    params: param
  })
}

// 查询个人账号
export function searchAccount(query) {
  return request({
    url: base_url + 'econtractAccount/searchAccount',
    method: 'get',
    params: query
  })
}

// 获取机构账号
export function fetchOrg(query) {
  return request({
    url: base_url + 'econtractOrg',
    method: 'get',
    params: query
  })
}

// 新增个人账号
export function createOrg(data) {
  return request({
    url: base_url + 'econtractOrg',
    method: 'post',
    params: data
  })
}

// 删除机构账号
export function deleteOrg(orgId) {
  return request({
    url: base_url + 'econtractOrg/' + orgId,
    method: 'delete'
  })
}

// 编辑机构账号
export function updateOrg(param) {
  return request({
    url: base_url + 'econtractOrg/' + param.orgId,
    method: 'put',
    params: param
  })
}
