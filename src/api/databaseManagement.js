import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/databaseManagement/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/databaseManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/databaseManagement/doDelete',
    method: 'post',
    data,
  })
}
