<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">添加角色</el-button>

    <el-table border :data="rolesList" style="width: 100%; margin-top: 30px">
      <el-table-column align="center" label="权限指令" width="220">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.role_name }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogType === 'edit' ? '修改权限' : '添加权限'" :visible.sync="dialogVisible">
      <el-form label-position="left" label-width="80px" :model="role" :rules="rules">
        <el-form-item label="权限名称">
          <el-input v-model="role.role_name" maxlength="50" minlength="2" placeholder="权限名称" />
        </el-form-item>
        <el-form-item label="权限KEY">
          <el-input v-model="role.key" :autosize="{ minRows: 2, maxRows: 20 }" placeholder="权限KEY" />
        </el-form-item>
        <!-- <el-form-item label="Desc">
          <el-input
            v-model="role.id"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item> -->
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            class="permission-tree"
            :data="routesData"
            :default-checked-keys="defaultKeys"
            :default-expand-all="true"
            node-key="id"
            :props="defaultProps"
            show-checkbox
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import path from 'path'
  import { deepClone } from '@/utils'
  import { doDelete, getList, getRoute } from '@/api/roleManagement'

  const defaultRole = {
    key: '',
    name: '',
    description: '',
    routes: [],
  }
  export default {
    data() {
      return {
        routesData: [],
        role: Object.assign({}, defaultRole),
        routes: [],
        defaultKeys: [],
        rolesList: [],
        dialogVisible: false,
        dialogType: 'new',
        checkStrictly: true,
        defaultProps: {
          children: 'child',
          label: 'name',
        },
        rules: {
          role_name: [{ required: true, message: 'type is required', trigger: 'change' }],
          key: [
            { required: true, message: 'type is required', trigger: 'change' },
            { pattern: /^A[0-9a-zA-Z-_]+/, message: '不符合要求' },
          ],
        },
      }
    },
    created() {
      // Mock: get all routes and roles list from server
      this.getRoutes()
      this.getRoles()
    },
    methods: {
      async getRoutes() {
        var req = { page: 1, page_size: 100000 }
        const res = await getRoute(req)
        this.serviceRoutes = res.permission
        console.log(res.permission)
        this.routes = res.data.permission
        this.routesData = res.data.permission
      },
      async getRoles() {
        // const res = await getList()
        var req = { page: 1, size: 1000 }
        const res = await getList(req)
        this.rolesList = res.list
      },

      generateArr(routes) {
        let data = []
        routes.forEach((route) => {
          data.push(route)
          if (route.children) {
            const temp = this.generateArr(route.children)
            if (temp.length > 0) {
              data = [...data, ...temp]
            }
          }
        })
        return data
      },
      handleAddRole() {
        this.role = Object.assign({}, defaultRole)
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedNodes([])
        }
        this.dialogType = 'new'
        this.dialogVisible = true
      },
      handleEdit(scope) {
        this.dialogType = 'edit'
        this.dialogVisible = true
        this.checkStrictly = true
        this.role = deepClone(scope.row)
        for (let item of scope.row.permission_id.split(',')) {
          this.defaultKeys.push(parseInt(item))
        }
        this.$nextTick(() => {
          this.role.routes = this.rolesList
          const routes = this.generateRoutes(this.routes)
          //this.$refs.tree.setCheckedNodes(this.generateArr(routes))
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
        })
      },
      handleDelete({ $index, row }) {
        this.$confirm('确认删除角色?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            var req = { id: row.id }
            await deleteRole(req)
            this.rolesList.splice($index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          })
          .catch((err) => {
            console.error(err)
          })
      },
      generateTree(routes, basePath = '/', checkedKeys) {
        const res = []
        // for (const route of routes) {
        //   const routePath = path.resolve(basePath, route.path);
        //   console.log(routePath);
        //   // recursive child routes
        //   if (route.children) {
        //     route.children = this.generateTree(
        //       route.children,
        //       routePath,
        //       checkedKeys
        //     );
        //   }

        //   if (
        //     checkedKeys.includes(routePath) ||
        //     (route.children && route.children.length >= 1)
        //   ) {
        //     res.push(route);
        //   }
        // }
        return res
      },
      async confirmRole() {
        const isEdit = this.dialogType === 'edit'
        const checkedKeys = this.$refs.tree.getCheckedKeys()
        if (checkedKeys.join(',').length > 0) {
          this.role.permission_id = checkedKeys.join(',')
        }
        this.role.action = 1
        if (isEdit) {
          await updateRole(this.role)
          // for (let index = 0; index < this.rolesList.length; index++) {
          //   if (this.rolesList[index].key === this.role.key) {
          //     this.rolesList.splice(index, 1, Object.assign({}, this.role));
          //     break;
          //   }
          // }
        } else {
          const { data } = await addRole(this.role)
          this.role.key = data.key
          this.rolesList.push(this.role)
        }

        const { id, role_name } = this.role
        this.dialogVisible = false
        this.$notify({
          title: 'Success',
          dangerouslyUseHTMLString: true,
          message: `
            <div>Role Key: ${id}</div>
            <div>Role Name: ${role_name}</div>
          `,
          type: 'success',
        })
      },
      // reference: src/view/layout/components/Sidebar/SidebarItem.vue
      onlyOneShowingChild(children = [], parent) {
        let onlyOneChild = null
        const showingChildren = children.filter((item) => !item.hidden)

        // When there is only one child route, the child route is displayed by default
        if (showingChildren.length === 1) {
          onlyOneChild = showingChildren[0]
          onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
          return onlyOneChild
        }

        // Show parent if there are no child route to display
        if (showingChildren.length === 0) {
          onlyOneChild = { ...parent, path: '', noShowingChildren: true }
          return onlyOneChild
        }

        return false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
