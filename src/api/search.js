import request from '@/utils/request'
import { base_url } from '@/utils/config'

// 查询文件
export function searchFileItem(query) {
  return request({
    url: base_url + 'fileItems/v3',
    method: 'get',
    params: query
  })
}
