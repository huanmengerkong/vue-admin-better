<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px" @close="close">
    <el-form ref="form" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="用户名" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="form.password" autocomplete="off" type="password" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model.trim="form.mobile" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <el-radio-group v-model="form.status" class="ml-4">
          <el-radio :label="0" size="large" value="0">禁用</el-radio>
          <el-radio :label="1" size="large" value="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-checkbox-group v-model="form.permissions">
          <el-checkbox v-for="(permission, index) in roleList" :key="index" :label="permission.id" :value="permission.id">
            {{ permission.role_name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doEdit } from '@/api/userManagement'
  import { getList } from '@/api/roleManagement'

  export default {
    name: 'UserManagementEdit',
    data() {
      // 自定义校验规则
      var validateTel = (rule, value, callback) => {
        if (!/^1[3-9]\d{9}$/.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(value)) {
          callback(new Error('输入正确的邮箱地址'))
        } else {
          callback()
        }
      }
      return {
        roleList: [],
        form: {
          status: 1,
          name: '',
          password: '',
          email: '',
          permissions: [],
        },
        rules: {
          name: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
          password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
          email: [
            { required: true, trigger: 'blur', message: '请输入邮箱' },
            { validator: validateEmail, message: '输入正确的邮箱地址', trigger: 'blur' },
          ],
          mobile: [
            { required: true, trigger: 'blur', message: '请输入手机号' },
            { validator: validateTel, message: '手机号格式不对', trigger: 'blur' },
          ],
          status: [{ required: true, trigger: 'blur', message: '请选择状态' }],
          permissions: [{ required: true, trigger: 'blur', message: '请选择权限' }],
        },
        title: '',
        dialogFormVisible: false,
      }
    },
    created() {},
    methods: {
      async showEdit(row) {
        var req = {}
        req.page = 1
        req.size = 10000
        req.status = 1
        const res = await getList(req)
        this.roleList = res.data.list
        if (!row) {
          this.title = '添加'
        } else {
          this.title = '编辑'
          this.form.permissions = row.role_id
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
