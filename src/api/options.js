import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 获取各项select的options选项
export function fetchOptions(query) {
  return request({
    url: base_url + 'options',
    method: 'get',
    params: query
  })
}
