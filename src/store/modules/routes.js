import { asyncRoutes, constantRoutes } from '@/router'
import { getRouterList } from '@/api/router'
import { convertRouter, filterAsyncRoutes } from '@/utils/handleRoutes'
import { getRoutesToken } from '@/utils/cookieFun'

const state = () => ({
  routes: [],
  partialRoutes: [],
})
const getters = {
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
}
const mutations = {
  setRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setAllRoutes(state, routes) {
    console.log('-------------------')
    console.log(routes)
    state.routes = constantRoutes.concat(routes)
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = constantRoutes.concat(routes)
  },
}
const actions = {
  async setRoutes({ commit }, permissions) {
    //开源版只过滤动态路由permissions，admin不再默认拥有全部权限
    const finallyAsyncRoutes = await filterAsyncRoutes([...asyncRoutes], permissions)
    commit('setRoutes', finallyAsyncRoutes)
    return finallyAsyncRoutes
  },
  async setAllRoutes({ commit }) {
    //let { data } = await getRouterList()
    // 从登录的cookie 中获取
    var str = getRoutesToken()
    if (str == '') {
      return accessRoutes
    }
    const data = JSON.parse(str)
    data.push({ path: '*', redirect: '/404', hidden: true })
    let accessRoutes = convertRouter(data)
    commit('setAllRoutes', accessRoutes)
    return accessRoutes
  },
  setAll({ commit }, accessRoutes) {
    commit('setAllRoutes', accessRoutes)
  },
  setPartialRoutes({ commit }, accessRoutes) {
    commit('setPartialRoutes', accessRoutes)
    return accessRoutes
  },
}
export default { state, getters, mutations, actions }
