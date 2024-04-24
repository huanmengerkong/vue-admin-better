import Cookies from 'js-cookie'

const Routes = 'route'
const RoleList = 'Role-list'
export function getRoutesToken() {
  return Cookies.get(Routes)
}

export function setRoutesToken(route) {
  return Cookies.set(Routes, route)
}

export function removeRoutesToken(route) {
  return Cookies.remove(Routes)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setRoleList(roleList) {
  return Cookies.set(RoleList, roleList)
}

export function getRoleList() {
  return Cookies.get(RoleList)
}
export function removeRoleList() {
  return Cookies.remove(RoleList)
}
