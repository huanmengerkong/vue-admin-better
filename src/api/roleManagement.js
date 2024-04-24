import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/roleManagement/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/roleManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/roleManagement/doDelete',
    method: 'post',
    data,
  })
}

export function getRoute(data) {
  return request({
    url: '/permission/tree',
    method: 'post',
    data,
  })
}
