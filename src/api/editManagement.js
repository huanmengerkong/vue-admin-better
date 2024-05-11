import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/editManagement/getList',
    method: 'post',
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/editManagement/doEdit',
    method: 'post',
    data,
  })
}

export function doDelete(data) {
  return request({
    url: '/editManagement/doDelete',
    method: 'post',
    data,
  })
}

export function field(data) {
  return request({
    url: '/editManagement/field',
    method: 'post',
    data,
  })
}
