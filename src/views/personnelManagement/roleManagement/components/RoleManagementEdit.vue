<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="角色名称" prop="role_name">
        <el-input v-model="form.role_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色码" prop="role_name">
        <el-input v-model="form.key" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否开启" prop="role_name">
        <el-radio-group v-model="form.status" class="ml-4">
          <el-radio :label="0" size="large" value="0">否</el-radio>
          <el-radio :label="1" size="large" value="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <input v-model="form.permission_id" autocomplete="off" type="hidden" />
      <el-form-item label="菜单" prop="menu">
        <el-tree
          v-model="form.route"
          autocomplete="off"
          :data="permissionList"
          :default-checked-keys="defaultCheckedKeys"
          :default-expanded-keys="defaultExpandedKeys"
          node-key="id"
          :props="defaultProps"
          show-checkbox
          style="max-width: 300px"
          @check="handleCheckChange"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit, getRoute } from '@/api/roleManagement'

  export default {
    name: 'RoleManagementEdit',
    data() {
      return {
        form: {
          id: '',
          permission_id: [],
        },
        defaultCheckedKeys: [],
        defaultExpandedKeys: [],
        rules: {
          permission: [{ required: true, trigger: 'blur', message: '请输入权限码' }],
        },
        permissionList: [],
        title: '',
        dialogFormVisible: false,
        defaultProps: {
          children: 'child',
          label: 'name',
        },
      }
    },
    created() {},
    methods: {
      handleCheckChange(checkedKeys, node, el) {
        console.log(node)
        this.form.permission_id = node.checkedKeys
      },
      async showEdit(row) {
        var req = { page: 1, page_size: 100000 }
        const res = await getRoute(req)
        this.permissionList = res.data.permission
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.defaultCheckedKeys = row.permission_tree.split(',')
          this.form = Object.assign({}, row)
        }
        this.dialogFormVisible = true
      },
      close() {
        this.$refs['form'].resetFields()
        this.form = this.$options.data().form
        this.dialogFormVisible = false
      },
      save() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            const { msg } = await doEdit(this.form)
            this.$baseMessage(msg, 'success')
            this.$emit('fetch-data')
            this.close()
          } else {
            return false
          }
        })
      },
    },
  }
</script>
